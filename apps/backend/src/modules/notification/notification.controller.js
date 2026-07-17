import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createNotificationSchema,
  updateNotificationSchema,
} from "./notification.validation.js";

import {
  createNotificationService,
  getAllNotificationsService,
  getNotificationByIdService,
  updateNotificationService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  getUnreadCountService,
  getMyNotificationsService,
  deleteNotificationService,
} from "./notification.service.js";

// Create Notification
const createNotification = asyncHandler(
  async (req, res) => {
    const validatedData =
      createNotificationSchema.parse(req.body);

    const notification =
      await createNotificationService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      notification,
      "Notification created successfully.",
      201
    );
  }
);

// Get All Notifications
const getAllNotifications = asyncHandler(
  async (req, res) => {
    const notifications =
      await getAllNotificationsService(
        req.user
      );

    return successResponse(
      res,
      notifications,
      "Notifications fetched successfully."
    );
  }
);

// Get My Notifications
const getMyNotifications = asyncHandler(
  async (req, res) => {
    const notifications =
      await getMyNotificationsService(
        req.user
      );

    return successResponse(
      res,
      notifications,
      "Notifications fetched successfully."
    );
  }
);

// Get Notification By Id
const getNotificationById = asyncHandler(
  async (req, res) => {
    const { notificationId } = req.params;

    const notification =
      await getNotificationByIdService(
        notificationId,
        req.user
      );

    return successResponse(
      res,
      notification,
      "Notification fetched successfully."
    );
  }
);

// Update Notification
const updateNotification = asyncHandler(
  async (req, res) => {
    const { notificationId } = req.params;

    const validatedData =
      updateNotificationSchema.parse(req.body);

    const notification =
      await updateNotificationService(
        notificationId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      notification,
      "Notification updated successfully."
    );
  }
);

// Mark Notification As Read
const markNotificationAsRead =
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification =
      await markNotificationAsReadService(
        notificationId,
        req.user
      );

    return successResponse(
      res,
      notification,
      "Notification marked as read."
    );
  });

// Mark All Notifications As Read
const markAllNotificationsAsRead =
  asyncHandler(async (req, res) => {
    const result =
      await markAllNotificationsAsReadService(
        req.user
      );

    return successResponse(
      res,
      result,
      "All notifications marked as read."
    );
  });

// Get Unread Count
const getUnreadCount = asyncHandler(
  async (req, res) => {
    const unreadCount =
      await getUnreadCountService(
        req.user
      );

    return successResponse(
      res,
      unreadCount,
      "Unread notification count fetched successfully."
    );
  }
);

// Delete Notification
const deleteNotification = asyncHandler(
  async (req, res) => {
    const { notificationId } = req.params;

    const notification =
      await deleteNotificationService(
        notificationId,
        req.user
      );

    return successResponse(
      res,
      notification,
      "Notification deleted successfully."
    );
  }
);

export {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  getNotificationById,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
};