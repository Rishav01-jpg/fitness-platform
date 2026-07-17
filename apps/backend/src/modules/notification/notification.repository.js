import Notification from "./notification.model.js";

// Create notification
const createNotification = async (
  notificationData
) => {
  return await Notification.create(
    notificationData
  );
};

// Find notification by ID
const findNotificationById = async (
  notificationId
) => {
  return await Notification.findById(
    notificationId
  );
};

// Get all notifications
const findAllNotifications = async () => {
  return await Notification.find({
    recordStatus: "ACTIVE",
  }).sort({
    createdAt: -1,
  });
};

// Get notifications by tenant
const findNotificationsByTenant = async (
  tenantId
) => {
  return await Notification.find({
    tenant: tenantId,
    recordStatus: "ACTIVE",
  }).sort({
    createdAt: -1,
  });
};

// Get notifications by recipient
const findNotificationsByRecipient =
  async (recipientId) => {
    return await Notification.find({
      recipient: recipientId,
      recordStatus: "ACTIVE",
    }).sort({
      createdAt: -1,
    });
  };

// Get unread notifications
const findUnreadNotifications =
  async (recipientId) => {
    return await Notification.find({
      recipient: recipientId,
      isRead: false,
      recordStatus: "ACTIVE",
    }).sort({
      createdAt: -1,
    });
  };

// Get unread notification count
const countUnreadNotifications =
  async (recipientId) => {
    return await Notification.countDocuments({
      recipient: recipientId,
      isRead: false,
      recordStatus: "ACTIVE",
    });
  };

// Update notification
const updateNotification = async (
  notificationId,
  updateData
) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Mark notification as read
const markNotificationAsRead =
  async (notificationId) => {
    return await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
  };

// Mark all notifications as read
const markAllNotificationsAsRead =
  async (recipientId) => {
    return await Notification.updateMany(
      {
        recipient: recipientId,
        isRead: false,
        recordStatus: "ACTIVE",
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );
  };

// Soft delete notification
const deleteNotification = async (
  notificationId
) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    {
      recordStatus: "DELETED",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
const updateEmailStatus = async (
  notificationId,
  emailSent
) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    {
      emailSent,
      emailSentAt: emailSent
        ? new Date()
        : null,
    },
    { new: true }
  );
};

export {
  createNotification,
  findNotificationById,
  findAllNotifications,
  findNotificationsByTenant,
  findNotificationsByRecipient,
  findUnreadNotifications,
  countUnreadNotifications,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
   updateEmailStatus
};