import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createDietitian,
  getAllDietitians,
  getDietitianById,
  updateDietitian,
  softDeleteDietitian,
} from "./dietitian.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  hasPermission(PERMISSIONS.CREATE_DIETITIAN),
  checkTenantStatus,
  checkSubscription,
  createDietitian
);

router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_DIETITIAN),
  getAllDietitians
);

router.get(
  "/:dietitianId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_DIETITIAN),
  getDietitianById
);

router.put(
  "/:dietitianId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.UPDATE_DIETITIAN),
  checkTenantStatus,
  checkSubscription,
  updateDietitian
);

router.delete(
  "/:dietitianId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.DELETE_DIETITIAN),
  checkTenantStatus,
  checkSubscription,
  softDeleteDietitian
);
export default router;