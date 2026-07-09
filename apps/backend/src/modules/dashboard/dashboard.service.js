import AppError from "../../shared/errors/AppError.js";

import { findTenantById } from "../tenant/tenant.repository.js";

import {
  createDashboard,
  findDashboardByCode,
} from "./dashboard.repository.js";

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

export { createDashboardService };