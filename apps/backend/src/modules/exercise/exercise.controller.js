import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createExerciseSchema,
  updateExerciseSchema,
} from "./exercise.validation.js";

import {
  createExerciseService,
  getAllExercisesService,
  getExerciseByIdService,
  updateExerciseService,
  deleteExerciseService,
} from "./exercise.service.js";

const createExercise = asyncHandler(async (req, res) => {
  const validatedData =
    createExerciseSchema.parse(req.body);

  const exercise =
    await createExerciseService(
      validatedData,
      req.user
    );

  return successResponse(
    res,
    exercise,
    "Exercise created successfully.",
    201
  );
});

//get all exercises
const getAllExercises = asyncHandler(async (req, res) => {
  const exercises = await getAllExercisesService(req.user);

  return successResponse(
    res,
    exercises,
    "Exercises fetched successfully."
  );
});

//get exercise by id
const getExerciseById = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exercise =
    await getExerciseByIdService(
      exerciseId,
      req.user
    );

  return successResponse(
    res,
    exercise,
    "Exercise fetched successfully."
  );
});

//update exercise
const updateExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const validatedData =
    updateExerciseSchema.parse(req.body);

  const exercise =
    await updateExerciseService(
      exerciseId,
      validatedData,
      req.user
    );

  return successResponse(
    res,
    exercise,
    "Exercise updated successfully."
  );
});

//soft delete exercise
const deleteExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exercise = await deleteExerciseService(
    exerciseId,
    req.user
  );

  return successResponse(
    res,
    exercise,
    "Exercise deleted successfully."
  );
});

export {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};