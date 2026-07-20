import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    dashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dashboard",
      required: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
    },

    dietitian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dietitian",
      default: null,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "MALE",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    height: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
      default: "",
    },

    emergencyContactName: {
      type: String,
      default: "",
    },

    emergencyContactPhone: {
      type: String,
      default: "",
    },

    medicalConditions: {
      type: String,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    profileImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    lastBirthdayWishSentAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model(
  "Client",
  clientSchema
);

export default Client;