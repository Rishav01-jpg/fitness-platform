import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "./attendance.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_ATTENDANCE),
  getAllAttendance
);

router.get(
  "/:attendanceId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_ATTENDANCE),
  getAttendanceById
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.CREATE_ATTENDANCE),
  checkTenantStatus,
  checkSubscription,
  createAttendance
);

router.put(
  "/:attendanceId",
  authenticate,
 authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.UPDATE_ATTENDANCE),
  checkTenantStatus,
  checkSubscription,
  updateAttendance
);

router.delete(
  "/:attendanceId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_ATTENDANCE),
  checkTenantStatus,
  checkSubscription,
  deleteAttendance
);

export default router;