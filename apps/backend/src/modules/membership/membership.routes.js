import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
  cancelMembership,
} from "./membership.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_MEMBERSHIP),
  getAllMemberships
);

router.get(
  "/:membershipId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_MEMBERSHIP),
  getMembershipById
);

router.put(
  "/:membershipId",
  authenticate,
 authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.UPDATE_MEMBERSHIP),
  checkTenantStatus,
  checkSubscription,
  updateMembership
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  hasPermission(PERMISSIONS.CREATE_MEMBERSHIP),
  checkTenantStatus,
  checkSubscription,
  createMembership
);

router.delete(
  "/:membershipId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.DELETE_MEMBERSHIP),
  checkTenantStatus,
  checkSubscription,
  cancelMembership
);

export default router;