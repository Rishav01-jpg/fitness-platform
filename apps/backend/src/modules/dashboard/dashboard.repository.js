import Dashboard from "./dashboard.model.js";

const createDashboard = async (dashboardData) => {
  return await Dashboard.create(dashboardData);
};

const findDashboardById = async (dashboardId) => {
  return await Dashboard.findById(dashboardId);
};

const findDashboardByCode = async (code) => {
  return await Dashboard.findOne({ code });
};

const findAllDashboards = async () => {
  return await Dashboard.find();
};

const findDashboardsByTenant = async (tenantId) => {
  return await Dashboard.find({ tenant: tenantId });
};

const updateDashboard = async (dashboardId, updateData) => {
  return await Dashboard.findByIdAndUpdate(
    dashboardId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const softDeleteDashboard = async (dashboardId) => {
  return await Dashboard.findByIdAndUpdate(
    dashboardId,
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
  createDashboard,
  findDashboardById,
  findDashboardByCode,
  findAllDashboards,
  findDashboardsByTenant,
  updateDashboard,
  softDeleteDashboard,
};