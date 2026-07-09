import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";
import checkDashboardLimit from "../../middlewares/plan.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboard,
  softDeleteDashboard,
} from "./dashboard.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
 authorize(ROLES.ADMIN) ,
  hasPermission(PERMISSIONS.CREATE_DASHBOARD),
  checkTenantStatus,
  checkSubscription,
  checkDashboardLimit,
  createDashboard
);
router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_DASHBOARD),
  getAllDashboards
);

router.get(
  "/:dashboardId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_DASHBOARD),
  getDashboardById
);

router.put(
  "/:dashboardId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.UPDATE_DASHBOARD),
  checkTenantStatus,
  checkSubscription,
  updateDashboard
);

router.delete(
  "/:dashboardId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.DELETE_DASHBOARD),
  checkTenantStatus,
  checkSubscription,
  softDeleteDashboard
);

export default router;