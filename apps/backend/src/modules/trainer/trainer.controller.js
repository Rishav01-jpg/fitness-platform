import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createTrainerSchema,
  updateTrainerSchema,
} from "./trainer.validation.js";

import {
  createTrainerService,
  getAllTrainersService,
  getTrainerByIdService,
  updateTrainerService,
  softDeleteTrainerService,
} from "./trainer.service.js";

//create trainer
const createTrainer = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = createTrainerSchema.parse(req.body);

  // Create trainer
  const trainer = await createTrainerService(
    validatedData,
    req.user
  );

  return successResponse(
    res,
    trainer,
    "Trainer created successfully.",
    201
  );
});

//get all trainers
const getAllTrainers = asyncHandler(async (req, res) => {
  const trainers = await getAllTrainersService(req.user);

  return successResponse(
    res,
    trainers,
    "Trainers fetched successfully."
  );
});

//get trainer by id
const getTrainerById = asyncHandler(async (req, res) => {
  const { trainerId } = req.params;

  const trainer = await getTrainerByIdService(
    trainerId,
    req.user
  );

  return successResponse(
    res,
    trainer,
    "Trainer fetched successfully."
  );
});

//update trainer
const updateTrainer = asyncHandler(async (req, res) => {
  const { trainerId } = req.params;

  const validatedData =
    updateTrainerSchema.parse(req.body);

  const trainer = await updateTrainerService(
    trainerId,
    validatedData,
    req.user
  );

  return successResponse(
    res,
    trainer,
    "Trainer updated successfully."
  );
});

//soft delete trainer
const softDeleteTrainer = asyncHandler(async (req, res) => {
  const { trainerId } = req.params;

  const trainer = await softDeleteTrainerService(
    trainerId,
    req.user
  );

  return successResponse(
    res,
    trainer,
    "Trainer deactivated successfully."
  );
});

export {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  softDeleteTrainer,
};