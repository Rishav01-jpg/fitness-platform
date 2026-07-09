import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import { createDashboardSchema } from "./dashboard.validation.js";
import { createDashboardService } from "./dashboard.service.js";

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

export { createDashboard };