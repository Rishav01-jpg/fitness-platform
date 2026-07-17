import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  getNotificationById,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
} from "./notification.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_NOTIFICATION),
  getAllNotifications
);

router.get(
  "/my",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER,
    ROLES.DIETITIAN,
    ROLES.CLIENT
  ),
  hasPermission(PERMISSIONS.VIEW_NOTIFICATION),
  getMyNotifications
);

router.get(
  "/unread-count",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER,
    ROLES.DIETITIAN,
    ROLES.CLIENT
  ),
  hasPermission(PERMISSIONS.VIEW_NOTIFICATION),
  getUnreadCount
);

router.patch(
  "/read-all",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER,
    ROLES.DIETITIAN,
    ROLES.CLIENT
  ),
  hasPermission(PERMISSIONS.UPDATE_NOTIFICATION),
  checkTenantStatus,
  checkSubscription,
  markAllNotificationsAsRead
);

router.get(
  "/:notificationId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.VIEW_NOTIFICATION),
  getNotificationById
);

router.put(
  "/:notificationId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.UPDATE_NOTIFICATION),
  checkTenantStatus,
  checkSubscription,
  updateNotification
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.CREATE_NOTIFICATION),
  checkTenantStatus,
  checkSubscription,
  createNotification
);

router.patch(
  "/:notificationId/read",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER,
    ROLES.DIETITIAN,
    ROLES.CLIENT
  ),
  hasPermission(PERMISSIONS.UPDATE_NOTIFICATION),
  checkTenantStatus,
  checkSubscription,
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_NOTIFICATION),
  checkTenantStatus,
  checkSubscription,
  deleteNotification
);

export default router;