import Membership from "./membership.model.js";

// Create membership
const createMembership = async (membershipData) => {
  return await Membership.create(membershipData);
};

// Find membership by ID
const findMembershipById = async (membershipId) => {
  return await Membership.findById(membershipId);
};

// Get all memberships
const findAllMemberships = async () => {
  return await Membership.find();
};

// Get memberships by tenant
const findMembershipsByTenant = async (tenantId) => {
  return await Membership.find({ tenant: tenantId });
};

// Get memberships by dashboard
const findMembershipsByDashboard = async (dashboardId) => {
  return await Membership.find({ dashboard: dashboardId });
};

// Get memberships by client
const findMembershipsByClient = async (clientId) => {
  return await Membership.find({ client: clientId });
};

// Get active membership for a client
const findActiveMembershipByClient = async (clientId) => {
  return await Membership.findOne({
    client: clientId,
    status: "ACTIVE",
  });
};

// Get memberships expiring between two dates
const findMembershipsExpiringBetween = async (
  startDate,
  endDate
) => {
  return await Membership.find({
    status: "ACTIVE",
    endDate: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("client");
};

// Count today's new memberships
const countNewMembershipsToday = async (
  tenantId
) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await Membership.countDocuments({
    tenant: tenantId,
    status: "ACTIVE",
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });
};

// Count memberships expiring within 3 days
const countMembershipsExpiringSoon =
  async (tenantId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminderDate = new Date(today);
    reminderDate.setDate(
      reminderDate.getDate() + 3
    );
    reminderDate.setHours(
      23,
      59,
      59,
      999
    );

    return await Membership.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
      endDate: {
        $gte: today,
        $lte: reminderDate,
      },
    });
  };

// Update membership
const updateMembership = async (
  membershipId,
  updateData
) => {
  return await Membership.findByIdAndUpdate(
    membershipId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Update membership reminder timestamp
const updateMembershipReminder = async (
  membershipId
) => {
  return await Membership.findByIdAndUpdate(
    membershipId,
    {
      lastReminderSentAt: new Date(),
    },
    {
      new: true,
    }
  );
};

// Expire memberships
const expireMemberships = async () => {
  return await Membership.updateMany(
    {
      status: "ACTIVE",
      endDate: {
        $lt: new Date(),
      },
    },
    {
      $set: {
        status: "EXPIRED",
      },
    }
  );
};

// Cancel membership
const cancelMembership = async (membershipId) => {
  return await Membership.findByIdAndUpdate(
    membershipId,
    {
      status: "CANCELLED",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createMembership,
  findMembershipById,
  findAllMemberships,
  findMembershipsByTenant,
  findMembershipsByDashboard,
  findMembershipsByClient,
  findActiveMembershipByClient,
  updateMembership,
  cancelMembership,
  findMembershipsExpiringBetween,
  updateMembershipReminder,
  expireMemberships,
  countNewMembershipsToday,
countMembershipsExpiringSoon,
};