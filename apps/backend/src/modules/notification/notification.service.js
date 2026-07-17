import AppError from "../../shared/errors/AppError.js";

import User from "../user/user.model.js";

import { ROLES } from "../../constants/roles.js";
import { sendEmail } from "../../shared/services/email.service.js";

import {
  createNotification,
  findNotificationById,
  findAllNotifications,
  findNotificationsByTenant,
  findNotificationsByRecipient,
  countUnreadNotifications,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
   updateEmailStatus,
} from "./notification.repository.js";

// Create notification
const createNotificationService = async (
  notificationData,
  user
) => {
  // Check recipient
  const recipient = await User.findById(
    notificationData.recipient
  );

  if (!recipient) {
    throw new AppError(
      "Recipient not found.",
      404
    );
  }

  // Tenant isolation
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      recipient.tenantId.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }
  }

  const notification = await createNotification({
  ...notificationData,
  tenant:
    user.role === ROLES.SUPER_ADMIN
      ? recipient.tenantId
      : user.tenantId,
  createdBy: user._id,
});

try {
  if (recipient.email) {
    await sendEmail({
      to: recipient.email,
      subject: notification.title,
      html: `
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
      `,
    });

    await updateEmailStatus(
      notification._id,
      true
    );
  }
} catch (error) {
  console.error("Email sending failed:", error.message);
}

return notification;
};

// Get all notifications
const getAllNotificationsService = async (
  user
) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllNotifications();
  }

  // Tenant Admin
  return await findNotificationsByTenant(
    user.tenantId
  );
};

// Get notification by id
const getNotificationByIdService = async (
  notificationId,
  user
) => {
  const notification =
    await findNotificationById(
      notificationId
    );

  if (!notification) {
    throw new AppError(
      "Notification not found.",
      404
    );
  }

  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return notification;
  }

  // Tenant isolation
  if (
    notification.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  return notification;
};

// Update notification
const updateNotificationService = async (
  notificationId,
  updateData,
  user
) => {
  const notification =
    await findNotificationById(
      notificationId
    );

  if (!notification) {
    throw new AppError(
      "Notification not found.",
      404
    );
  }

  // Tenant isolation
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      notification.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }
  }

  // Validate recipient if changing
  if (updateData.recipient) {
    const recipient = await User.findById(
      updateData.recipient
    );

    if (!recipient) {
      throw new AppError(
        "Recipient not found.",
        404
      );
    }

    if (
      recipient.tenantId.toString() !==
      notification.tenant.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }
  }

  return await updateNotification(
    notificationId,
    updateData
  );
};

// Mark notification as read
const markNotificationAsReadService =
  async (notificationId, user) => {
    const notification =
      await findNotificationById(
        notificationId
      );

    if (!notification) {
      throw new AppError(
        "Notification not found.",
        404
      );
    }

    // Super Admin
    if (user.role !== ROLES.SUPER_ADMIN) {
      if (
        notification.recipient.toString() !==
        user._id.toString()
      ) {
        throw new AppError(
          "Access denied.",
          403
        );
      }
    }

    return await markNotificationAsRead(
      notificationId
    );
  };

// Mark all notifications as read
const markAllNotificationsAsReadService =
  async (user) => {
    await markAllNotificationsAsRead(
      user._id
    );

    return {
      success: true,
    };
  };

// Get unread count
const getUnreadCountService = async (
  user
) => {
  const unreadCount =
    await countUnreadNotifications(
      user._id
    );

    return {
      unreadCount,
    };
};

// Get logged in user's notifications
const getMyNotificationsService =
  async (user) => {
    return await findNotificationsByRecipient(
      user._id
    );
  };

// Delete notification
const deleteNotificationService =
  async (notificationId, user) => {
    const notification =
      await findNotificationById(
        notificationId
      );

    if (!notification) {
      throw new AppError(
        "Notification not found.",
        404
      );
    }

    // Tenant isolation
    if (user.role !== ROLES.SUPER_ADMIN) {
      if (
        notification.tenant.toString() !==
        user.tenantId.toString()
      ) {
        throw new AppError(
          "Access denied.",
          403
        );
      }
    }

    return await deleteNotification(
      notificationId
    );
  };

export {
  createNotificationService,
  getAllNotificationsService,
  getNotificationByIdService,
  updateNotificationService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  getUnreadCountService,
  getMyNotificationsService,
  deleteNotificationService,
};