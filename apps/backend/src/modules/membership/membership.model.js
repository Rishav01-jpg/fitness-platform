import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
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

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    durationType: {
      type: String,
      enum: ["DAY", "MONTH", "YEAR"],
      default: "MONTH",
    },

    amount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "EXPIRED",
        "CANCELLED"
      ],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model(
  "Membership",
  membershipSchema
);

export default Membership;