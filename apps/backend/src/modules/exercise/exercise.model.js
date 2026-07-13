import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    muscleGroup: {
      type: String,
      enum: [
        "CHEST",
        "BACK",
        "SHOULDERS",
        "BICEPS",
        "TRICEPS",
        "LEGS",
        "ABS",
        "GLUTES",
        "FULL_BODY",
        "CARDIO",
      ],
      required: true,
    },

    equipment: {
      type: String,
      enum: [
        "BODY_WEIGHT",
        "DUMBBELL",
        "BARBELL",
        "CABLE",
        "MACHINE",
        "KETTLEBELL",
        "RESISTANCE_BAND",
        "OTHER",
      ],
      default: "BODY_WEIGHT",
    },

    difficulty: {
      type: String,
      enum: [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
      ],
      default: "BEGINNER",
    },

    exerciseType: {
      type: String,
      enum: [
        "STRENGTH",
        "CARDIO",
        "FLEXIBILITY",
        "MOBILITY",
      ],
      default: "STRENGTH",
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model(
  "Exercise",
  exerciseSchema
);

export default Exercise;