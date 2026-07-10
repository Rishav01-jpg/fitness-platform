import Dietitian from "./dietitian.model.js";

// Create dietitian
const createDietitian = async (dietitianData) => {
  return await Dietitian.create(dietitianData);
};

// Find dietitian by ID
const findDietitianById = async (dietitianId) => {
  return await Dietitian.findById(dietitianId);
};

// Find dietitian by email
const findDietitianByEmail = async (email) => {
  return await Dietitian.findOne({ email });
};

// Find dietitian by phone
const findDietitianByPhone = async (phone) => {
  return await Dietitian.findOne({ phone });
};

// Get all dietitians
const findAllDietitians = async () => {
  return await Dietitian.find();
};

// Get dietitians by tenant
const findDietitiansByTenant = async (tenantId) => {
  return await Dietitian.find({ tenant: tenantId });
};

// Get dietitians by dashboard
const findDietitiansByDashboard = async (dashboardId) => {
  return await Dietitian.find({ dashboard: dashboardId });
};

// Update dietitian
const updateDietitian = async (
  dietitianId,
  updateData
) => {
  return await Dietitian.findByIdAndUpdate(
    dietitianId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft delete dietitian
const softDeleteDietitian = async (
  dietitianId
) => {
  return await Dietitian.findByIdAndUpdate(
    dietitianId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createDietitian,
  findDietitianById,
  findDietitianByEmail,
  findDietitianByPhone,
  findAllDietitians,
  findDietitiansByTenant,
  findDietitiansByDashboard,
  updateDietitian,
  softDeleteDietitian,
};