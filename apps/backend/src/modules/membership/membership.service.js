import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";
import Client from "../client/client.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createMembership,
  findMembershipById,
  findActiveMembershipByClient,
  findAllMemberships,
  findMembershipsByTenant,
  updateMembership,
  cancelMembership,
} from "./membership.repository.js";

const calculateEndDate = (
  startDate,
  duration,
  durationType
) => {
  const endDate = new Date(startDate);

  switch (durationType) {
    case "DAY":
      endDate.setDate(
        endDate.getDate() + duration
      );
      break;

    case "MONTH":
      endDate.setMonth(
        endDate.getMonth() + duration
      );
      break;

    case "YEAR":
      endDate.setFullYear(
        endDate.getFullYear() + duration
      );
      break;

    default:
      throw new AppError(
        "Invalid duration type.",
        400
      );
  }

  return endDate;
};

const createMembershipService = async (
  membershipData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    membershipData.dashboard
  );

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Check client
  const client = await Client.findById(
    membershipData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Only one active membership allowed
  const activeMembership =
    await findActiveMembershipByClient(
      membershipData.client
    );

  if (activeMembership) {
    throw new AppError(
      "Client already has an active membership.",
      409
    );
  }

  const startDate =
    membershipData.startDate || new Date();

  const endDate = calculateEndDate(
    startDate,
    membershipData.duration,
    membershipData.durationType
  );

  return await createMembership({
    ...membershipData,
    tenant: user.tenantId,
    startDate,
    endDate,
  });
};

//get all membership of tenant
const getAllMembershipsService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllMemberships();
  }

  // Tenant Admin
  return await findMembershipsByTenant(user.tenantId);
};

//get membership by id
const getMembershipByIdService = async (
  membershipId,
  user
) => {
  const membership = await findMembershipById(
    membershipId
  );

  if (!membership) {
    throw new AppError(
      "Membership not found.",
      404
    );
  }

  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return membership;
  }

  // Tenant Admin
  if (
    membership.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return membership;
};

//update membership
const updateMembershipService = async (
  membershipId,
  updateData,
  user
) => {
  const membership = await findMembershipById(
    membershipId
  );

  if (!membership) {
    throw new AppError(
      "Membership not found.",
      404
    );
  }

  // Tenant isolation
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      membership.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Validate dashboard (if changing)
  if (updateData.dashboard) {
    const dashboard = await Dashboard.findById(
      updateData.dashboard
    );

    if (!dashboard) {
      throw new AppError(
        "Dashboard not found.",
        404
      );
    }

    if (
      dashboard.tenant.toString() !==
      membership.tenant.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }
  }

  // Validate client (if changing)
  if (updateData.client) {
    const client = await Client.findById(
      updateData.client
    );

    if (!client) {
      throw new AppError(
        "Client not found.",
        404
      );
    }

    if (
      client.tenant.toString() !==
      membership.tenant.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }

    // Check active membership only if client changes
    if (
      updateData.client !==
      membership.client.toString()
    ) {
      const existingMembership =
        await findActiveMembershipByClient(
          updateData.client
        );

      if (existingMembership) {
        throw new AppError(
          "Client already has an active membership.",
          409
        );
      }
    }
  }

  // Recalculate endDate if needed
  if (
    updateData.startDate ||
    updateData.duration ||
    updateData.durationType
  ) {
    const startDate =
      updateData.startDate ||
      membership.startDate;

    const duration =
      updateData.duration ||
      membership.duration;

    const durationType =
      updateData.durationType ||
      membership.durationType;

    updateData.endDate = calculateEndDate(
      startDate,
      duration,
      durationType
    );
  }

  return await updateMembership(
    membershipId,
    updateData
  );
};

//cancel membership
const cancelMembershipService = async (
  membershipId,
  user
) => {
  const membership = await findMembershipById(
    membershipId
  );

  if (!membership) {
    throw new AppError(
      "Membership not found.",
      404
    );
  }

  // Super Admin can cancel any membership
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      membership.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await cancelMembership(membershipId);
};

export {
  createMembershipService,
  getAllMembershipsService,
  getMembershipByIdService,
  updateMembershipService,
  cancelMembershipService,
};