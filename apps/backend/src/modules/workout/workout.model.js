import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
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
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    goal: {
      type: String,
      enum: [
        "WEIGHT_LOSS",
        "MUSCLE_GAIN",
        "STRENGTH",
        "ENDURANCE",
        "GENERAL_FITNESS",
      ],
      default: "GENERAL_FITNESS",
    },

    durationInWeeks: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "COMPLETED",
        "INACTIVE",
      ],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model(
  "Workout",
  workoutSchema
);


export default Workout;