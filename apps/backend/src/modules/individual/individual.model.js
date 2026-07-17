import mongoose from "mongoose";

const individualSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: [
        "MALE",
        "FEMALE",
        "OTHER",
      ],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },

    height: {
      type: Number,
      required: true,
      min: 0,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    bmi: {
      type: Number,
      default: 0,
    },

    fitnessGoal: {
      type: String,
      enum: [
        "WEIGHT_LOSS",
        "WEIGHT_GAIN",
        "MUSCLE_GAIN",
        "MAINTENANCE",
      ],
      required: true,
    },

    activityLevel: {
      type: String,
      enum: [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
      ],
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
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

const Individual = mongoose.model(
  "Individual",
  individualSchema
);

export default Individual;