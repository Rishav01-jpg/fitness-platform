import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: [
        "GENERAL",
        "MEMBERSHIP",
        "PAYMENT",
        "INVOICE",
        "ATTENDANCE",
        "WORKOUT",
        "PROGRESS",
        "SUBSCRIPTION",
        "SYSTEM",
      ],
      default: "GENERAL",
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
      default: "MEDIUM",
    },

    channel: {
      type: String,
      enum: [
        "IN_APP",
        "EMAIL",
        "BOTH",
      ],
      default: "IN_APP",
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },

    actionUrl: {
      type: String,
      default: "",
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recordStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "DELETED",
      ],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;