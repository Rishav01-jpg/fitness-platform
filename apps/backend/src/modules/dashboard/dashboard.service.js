import AppError from "../../shared/errors/AppError.js";

import { findTenantById } from "../tenant/tenant.repository.js";

import {
  createDashboard,
  findDashboardByCode,
  findDashboardById,
  findAllDashboards,
  findDashboardsByTenant,
  updateDashboard,
  softDeleteDashboard,
} from "./dashboard.repository.js";

import { ROLES } from "../../constants/roles.js";

const createDashboardService = async (dashboardData, tenantId) => {
  // Check tenant
  const tenant = await findTenantById(tenantId);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  // Check duplicate dashboard code
  const existingDashboard = await findDashboardByCode(
    dashboardData.code
  );

  if (existingDashboard) {
    throw new AppError(
      "Dashboard code already exists.",
      409
    );
  }

  // Create dashboard and automatically attach tenant
  const dashboard = await createDashboard({
    ...dashboardData,
    tenant: tenantId,
  });

  return dashboard;
};

//get all dashboards
const getAllDashboardsService = async (user) => {
  // Super Admin can view all dashboards
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllDashboards();
  }

  // Tenant Admin can view only their dashboards
  return await findDashboardsByTenant(user.tenantId);
};


//get dashboard by id
const getDashboardByIdService = async (
  dashboardId,
  user
) => {
  const dashboard = await findDashboardById(dashboardId);

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Super Admin can access everything
  if (user.role === ROLES.SUPER_ADMIN) {
    return dashboard;
  }

  // Tenant Admin can access only own dashboards
  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return dashboard;
};

//update dashboard
const updateDashboardService = async (
  dashboardId,
  updateData,
  user
) => {
  const dashboard = await findDashboardById(dashboardId);

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Super Admin can update any dashboard
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      dashboard.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Check duplicate code
  if (
    updateData.code &&
    updateData.code !== dashboard.code
  ) {
    const existingDashboard =
      await findDashboardByCode(updateData.code);

    if (existingDashboard) {
      throw new AppError(
        "Dashboard code already exists.",
        409
      );
    }
  }

  return await updateDashboard(
    dashboardId,
    updateData
  );
};

//soft delete dashboard
const softDeleteDashboardService = async (
  dashboardId,
  user
) => {
  const dashboard = await findDashboardById(dashboardId);

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Super Admin can delete any dashboard
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      dashboard.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteDashboard(dashboardId);
};

export {
  createDashboardService,
  getAllDashboardsService,
  getDashboardByIdService,
  updateDashboardService,
  softDeleteDashboardService,
};