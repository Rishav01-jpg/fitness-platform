import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import { createSubscription } from "./subscription.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.CREATE_SUBSCRIPTION),
  createSubscription
);

export default router;