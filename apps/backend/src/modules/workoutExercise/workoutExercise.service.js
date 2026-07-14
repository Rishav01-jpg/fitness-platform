import AppError from "../../shared/errors/AppError.js";

import Workout from "../workout/workout.model.js";
import Exercise from "../exercise/exercise.model.js";
import { ROLES } from "../../constants/roles.js";


import {
  createWorkoutExercise,
  findWorkoutExerciseById,
  findWorkoutExercisesByWorkout,
  updateWorkoutExercise,
  softDeleteWorkoutExercise,
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

//get all workoutexercise
const getWorkoutExercisesService = async (
  workoutId,
  user
) => {
  const workout = await Workout.findById(workoutId);

  if (!workout) {
    throw new AppError("Workout not found.", 404);
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    workout.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return await findWorkoutExercisesByWorkout(
    workoutId
  );
};

//get workout exercise by id
const getWorkoutExerciseByIdService = async (
  workoutExerciseId,
  user
) => {
  const workoutExercise =
    await findWorkoutExerciseById(workoutExerciseId);

  if (!workoutExercise) {
    throw new AppError(
      "Workout exercise not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    workoutExercise.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return workoutExercise;
};

// update workout exercise
const updateWorkoutExerciseService = async (
  workoutExerciseId,
  updateData,
  user
) => {
  const workoutExercise =
    await findWorkoutExerciseById(workoutExerciseId);

  if (!workoutExercise) {
    throw new AppError(
      "Workout exercise not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    workoutExercise.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // If changing exercise, validate it
  if (
    updateData.exercise &&
    updateData.exercise.toString() !==
      workoutExercise.exercise._id.toString()
  ) {
    const exercise = await Exercise.findById(
      updateData.exercise
    );

    if (!exercise) {
      throw new AppError(
        "Exercise not found.",
        404
      );
    }

    if (
      exercise.tenant.toString() !==
      workoutExercise.tenant.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }

    const existing =
      await WorkoutExercise.findOne({
        workout: workoutExercise.workout._id,
        exercise: updateData.exercise,
        status: "ACTIVE",
      });

    if (existing) {
      throw new AppError(
        "Exercise already added to this workout.",
        409
      );
    }
  }

  return await updateWorkoutExercise(
    workoutExerciseId,
    updateData
  );
};

//soft delete workout exercise
const deleteWorkoutExerciseService = async (
  workoutExerciseId,
  user
) => {
  const workoutExercise =
    await findWorkoutExerciseById(workoutExerciseId);

  if (!workoutExercise) {
    throw new AppError(
      "Workout exercise not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    workoutExercise.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return await softDeleteWorkoutExercise(
    workoutExerciseId
  );
};

export {
  createWorkoutExerciseService,
  getWorkoutExercisesService,
  getWorkoutExerciseByIdService,
  updateWorkoutExerciseService,
  deleteWorkoutExerciseService,
};