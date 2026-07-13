import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createWorkoutSchema,
  updateWorkoutSchema,
} from "./workout.validation.js";

import {
  createWorkoutService,
  getAllWorkoutsService,
  getWorkoutByIdService,
  updateWorkoutService,
  deleteWorkoutService,
} from "./workout.service.js";

const createWorkout = asyncHandler(async (req, res) => {
  const validatedData =
    createWorkoutSchema.parse(req.body);

  const workout =
    await createWorkoutService(
      validatedData,
      req.user
    );

  return successResponse(
    res,
    workout,
    "Workout created successfully.",
    201
  );
});

//get all workouts

const getAllWorkouts = asyncHandler(async (req, res) => {
  const workouts = await getAllWorkoutsService(req.user);

  return successResponse(
    res,
    workouts,
    "Workouts fetched successfully."
  );
});

//get workout by id
const getWorkoutById = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  const workout = await getWorkoutByIdService(
    workoutId,
    req.user
  );

  return successResponse(
    res,
    workout,
    "Workout fetched successfully."
  );
});

//update workouts
const updateWorkout = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  const validatedData =
    updateWorkoutSchema.parse(req.body);

  const workout = await updateWorkoutService(
    workoutId,
    validatedData,
    req.user
  );

  return successResponse(
    res,
    workout,
    "Workout updated successfully."
  );
});

//soft delete workouts
const deleteWorkout = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  const workout = await deleteWorkoutService(
    workoutId,
    req.user
  );

  return successResponse(
    res,
    workout,
    "Workout deleted successfully."
  );
});

export {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};