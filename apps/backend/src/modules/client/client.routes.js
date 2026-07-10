import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import { createClient } from "./client.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  hasPermission(PERMISSIONS.CREATE_CLIENT),
  checkTenantStatus,
  checkSubscription,
  createClient
);

export default router;