import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import { createWorkout } from "./workout.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.TRAINER),
  hasPermission(PERMISSIONS.CREATE_WORKOUT),
  checkTenantStatus,
  checkSubscription,
  createWorkout
);

export default router;