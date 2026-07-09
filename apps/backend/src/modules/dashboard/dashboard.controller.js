import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createDashboardSchema,
  updateDashboardSchema,
} from "./dashboard.validation.js";

import {
  createDashboardService,
  getAllDashboardsService,
  getDashboardByIdService,
  updateDashboardService,
  softDeleteDashboardService,
} from "./dashboard.service.js";

const createDashboard = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = createDashboardSchema.parse(req.body);

  // Create dashboard for the logged-in tenant
  const dashboard = await createDashboardService(
    validatedData,
    req.user.tenantId
  );

  return successResponse(
    res,
    dashboard,
    "Dashboard created successfully.",
    201
  );
});

//get all dashboards
const getAllDashboards = asyncHandler(async (req, res) => {
  const dashboards = await getAllDashboardsService(req.user);

  return successResponse(
    res,
    dashboards,
    "Dashboards fetched successfully."
  );
});
//get dashboard by id 
const getDashboardById = asyncHandler(
  async (req, res) => {
    const { dashboardId } = req.params;

    const dashboard =
      await getDashboardByIdService(
        dashboardId,
        req.user
      );

    return successResponse(
      res,
      dashboard,
      "Dashboard fetched successfully."
    );
  }
);

//update dashboard 
const updateDashboard = asyncHandler(async (req, res) => {
  const { dashboardId } = req.params;

  const validatedData =
    updateDashboardSchema.parse(req.body);

  const dashboard =
    await updateDashboardService(
      dashboardId,
      validatedData,
      req.user
    );

  return successResponse(
    res,
    dashboard,
    "Dashboard updated successfully."
  );
});

//soft selete dashboard
const softDeleteDashboard = asyncHandler(
  async (req, res) => {
    const { dashboardId } = req.params;

    const dashboard =
      await softDeleteDashboardService(
        dashboardId,
        req.user
      );

    return successResponse(
      res,
      dashboard,
      "Dashboard deactivated successfully."
    );
  }
);

export {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboard,
  softDeleteDashboard,
};