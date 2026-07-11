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
};