import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createDietitian,
  findDietitianById,
  findDietitianByEmail,
  findDietitianByPhone,
  findAllDietitians,
  findDietitiansByTenant,
  updateDietitian,
  softDeleteDietitian,
} from "./dietitian.repository.js";

const createDietitianService = async (
  dietitianData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    dietitianData.dashboard
  );

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Dashboard must belong to logged-in tenant
  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Duplicate email
  const existingEmail = await findDietitianByEmail(
    dietitianData.email
  );

  if (existingEmail) {
    throw new AppError(
      "Dietitian email already exists.",
      409
    );
  }

  // Duplicate phone
  const existingPhone = await findDietitianByPhone(
    dietitianData.phone
  );

  if (existingPhone) {
    throw new AppError(
      "Dietitian phone already exists.",
      409
    );
  }

  // Create dietitian
  return await createDietitian({
    ...dietitianData,
    tenant: user.tenantId,
  });
};

//get all dietitian
const getAllDietitiansService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllDietitians();
  }

  // Tenant Admin
  return await findDietitiansByTenant(user.tenantId);
};

//get dietitians by id
const getDietitianByIdService = async (
  dietitianId,
  user
) => {
  const dietitian = await findDietitianById(dietitianId);

  if (!dietitian) {
    throw new AppError("Dietitian not found.", 404);
  }

  // Super Admin can access everything
  if (user.role === ROLES.SUPER_ADMIN) {
    return dietitian;
  }

  // Tenant Admin can access only own dietitians
  if (
    dietitian.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return dietitian;
};

//update dietitian
const updateDietitianService = async (
  dietitianId,
  updateData,
  user
) => {
  const dietitian = await findDietitianById(dietitianId);

  if (!dietitian) {
    throw new AppError("Dietitian not found.", 404);
  }

  // Super Admin can update any dietitian
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      dietitian.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Duplicate email
  if (
    updateData.email &&
    updateData.email !== dietitian.email
  ) {
    const existingEmail = await findDietitianByEmail(
      updateData.email
    );

    if (existingEmail) {
      throw new AppError(
        "Dietitian email already exists.",
        409
      );
    }
  }

  // Duplicate phone
  if (
    updateData.phone &&
    updateData.phone !== dietitian.phone
  ) {
    const existingPhone = await findDietitianByPhone(
      updateData.phone
    );

    if (existingPhone) {
      throw new AppError(
        "Dietitian phone already exists.",
        409
      );
    }
  }

  return await updateDietitian(
    dietitianId,
    updateData
  );
};

//soft delete dietitian
const softDeleteDietitianService = async (
  dietitianId,
  user
) => {
  const dietitian = await findDietitianById(dietitianId);

  if (!dietitian) {
    throw new AppError("Dietitian not found.", 404);
  }

  // Super Admin can delete any dietitian
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      dietitian.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteDietitian(dietitianId);
};

export {
  createDietitianService,
  getAllDietitiansService,
  getDietitianByIdService,
  updateDietitianService,
  softDeleteDietitianService,
};