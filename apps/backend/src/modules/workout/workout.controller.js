import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createWorkoutSchema,
} from "./workout.validation.js";

import {
  createWorkoutService,
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

export {
  createWorkout,
};