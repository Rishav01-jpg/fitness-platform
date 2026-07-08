import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["BASIC", "PRO", "ENTERPRISE"],
    },

    price: {
      type: Number,
      required: true,
    },

    billingCycle: {
      type: String,
      enum: ["YEARLY"],
      default: "YEARLY",
    },

    dashboardLimit: {
      type: Number,
      default: 1,
    },

    unlimitedDashboards: {
      type: Boolean,
      default: false,
    },

    unlimitedClients: {
      type: Boolean,
      default: true,
    },

    unlimitedTrainers: {
      type: Boolean,
      default: true,
    },

    unlimitedDietitians: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;