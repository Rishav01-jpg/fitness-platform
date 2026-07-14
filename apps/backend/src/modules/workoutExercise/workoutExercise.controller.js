import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createWorkoutExerciseSchema,
  updateWorkoutExerciseSchema,
} from "./workoutExercise.validation.js";

import {
  createWorkoutExerciseService,
  getWorkoutExercisesService,
  getWorkoutExerciseByIdService,
  updateWorkoutExerciseService,
  deleteWorkoutExerciseService,
} from "./workoutExercise.service.js";

const createWorkoutExercise = asyncHandler(
  async (req, res) => {
    const validatedData =
      createWorkoutExerciseSchema.parse(req.body);

    const workoutExercise =
      await createWorkoutExerciseService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      workoutExercise,
      "Exercise added to workout successfully.",
      201
    );
  }
);

//get all workout exercise
const getWorkoutExercises = asyncHandler(
  async (req, res) => {
    const { workoutId } = req.params;

    const exercises =
      await getWorkoutExercisesService(
        workoutId,
        req.user
      );

    return successResponse(
      res,
      exercises,
      "Workout exercises fetched successfully."
    );
  }
);

//get workout exercise by id
const getWorkoutExerciseById = asyncHandler(
  async (req, res) => {
    const { workoutExerciseId } = req.params;

    const workoutExercise =
      await getWorkoutExerciseByIdService(
        workoutExerciseId,
        req.user
      );

    return successResponse(
      res,
      workoutExercise,
      "Workout exercise fetched successfully."
    );
  }
);

//update workout exercise
const updateWorkoutExercise = asyncHandler(
  async (req, res) => {
    const { workoutExerciseId } = req.params;

    const validatedData =
      updateWorkoutExerciseSchema.parse(req.body);

    const workoutExercise =
      await updateWorkoutExerciseService(
        workoutExerciseId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      workoutExercise,
      "Workout exercise updated successfully."
    );
  }
);

//soft delete workout exercise
const deleteWorkoutExercise = asyncHandler(
  async (req, res) => {
    const { workoutExerciseId } = req.params;

    const workoutExercise =
      await deleteWorkoutExerciseService(
        workoutExerciseId,
        req.user
      );

    return successResponse(
      res,
      workoutExercise,
      "Workout exercise deleted successfully."
    );
  }
);
export {
  createWorkoutExercise,
  getWorkoutExercises,
  getWorkoutExerciseById,
  updateWorkoutExercise,
  deleteWorkoutExercise,
};