import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 1,
    },

    height: {
      type: Number,
      required: true,
      min: 1,
    },

    bmi: {
      type: Number,
      default: 0,
    },

    bodyFat: {
      type: Number,
      default: null,
      min: 0,
    },

    chest: {
      type: Number,
      default: null,
    },

    waist: {
      type: Number,
      default: null,
    },

    hips: {
      type: Number,
      default: null,
    },

    biceps: {
      type: Number,
      default: null,
    },

    thigh: {
      type: Number,
      default: null,
    },

    shoulder: {
      type: Number,
      default: null,
    },

    neck: {
      type: Number,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    recordedDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
      ],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model(
  "Progress",
  progressSchema
);

export default Progress;