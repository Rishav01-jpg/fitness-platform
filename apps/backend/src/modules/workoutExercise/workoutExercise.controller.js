import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createWorkoutExerciseSchema,
} from "./workoutExercise.validation.js";

import {
  createWorkoutExerciseService,
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

export {
  createWorkoutExercise,
};