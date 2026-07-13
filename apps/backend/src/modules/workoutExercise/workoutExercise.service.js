import AppError from "../../shared/errors/AppError.js";

import Workout from "../workout/workout.model.js";
import Exercise from "../exercise/exercise.model.js";

import {
  createWorkoutExercise,
} from "./workoutExercise.repository.js";

import WorkoutExercise from "./workoutExercise.model.js";

const createWorkoutExerciseService = async (
  data,
  user
) => {
  // Workout exists
  const workout = await Workout.findById(data.workout);

  if (!workout) {
    throw new AppError("Workout not found.", 404);
  }

  // Exercise exists
  const exercise = await Exercise.findById(data.exercise);

  if (!exercise) {
    throw new AppError("Exercise not found.", 404);
  }

  // Workout tenant check
  if (
    workout.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Exercise tenant check
  if (
    exercise.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Prevent duplicate exercise in same workout
  const existing =
    await WorkoutExercise.findOne({
      workout: data.workout,
      exercise: data.exercise,
      status: "ACTIVE",
    });

  if (existing) {
    throw new AppError(
      "Exercise already added to this workout.",
      409
    );
  }

  return await createWorkoutExercise({
    ...data,
    tenant: user.tenantId,
  });
};

export {
  createWorkoutExerciseService,
};