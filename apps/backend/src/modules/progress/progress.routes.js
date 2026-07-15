import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";


import {
  createProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} from "./progress.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_PROGRESS),
  getAllProgress
);

router.get(
  "/:progressId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_PROGRESS),
  getProgressById
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.CREATE_PROGRESS),
  checkTenantStatus,
  checkSubscription,
  createProgress
);

router.put(
  "/:progressId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.UPDATE_PROGRESS),
  checkTenantStatus,
  checkSubscription,
  updateProgress
);

router.delete(
  "/:progressId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_PROGRESS),
  checkTenantStatus,
  checkSubscription,
  deleteProgress
);

export default router;