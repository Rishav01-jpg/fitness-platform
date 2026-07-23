import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createTrainerSchema,
  updateTrainerSchema,
  trainerLoginSchema,
  updateTrainerProfileSchema,
  trainerChangePasswordSchema,
  trainerResetPasswordSchema,
} from "./trainer.validation.js";

import {
  createTrainerService,
  getAllTrainersService,
  getTrainerByIdService,
  updateTrainerService,
  softDeleteTrainerService,
  loginTrainerService,
  getTrainerProfileService,
  updateTrainerProfileService,
  changeTrainerPasswordService,
  resetTrainerPasswordService,
} from "./trainer.service.js";

// Trainer login
const loginTrainer = asyncHandler(async (req, res) => {
  const validatedData =
    trainerLoginSchema.parse(req.body);

  const result = await loginTrainerService(
    validatedData
  );

  return successResponse(
    res,
    result,
    "Trainer logged in successfully."
  );
});
// Get logged-in trainer profile
const getTrainerProfile = asyncHandler(async (req, res) => {
  const trainer = await getTrainerProfileService(
    req.user
  );

  return successResponse(
    res,
    trainer,
    "Trainer profile fetched successfully."
  );
});
// Update logged-in trainer profile
const updateTrainerProfile = asyncHandler(
  async (req, res) => {
    const validatedData =
      updateTrainerProfileSchema.parse(req.body);

    const trainer =
      await updateTrainerProfileService(
        req.user,
        validatedData
      );

    return successResponse(
      res,
      trainer,
      "Trainer profile updated successfully."
    );
  }
);
// Trainer change own password
const changeTrainerPassword = asyncHandler(
  async (req, res) => {
    const validatedData =
      trainerChangePasswordSchema.parse(req.body);

    await changeTrainerPasswordService(
      req.user,
      validatedData
    );

    return successResponse(
      res,
      null,
      "Password changed successfully."
    );
  }
);
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
// Admin reset trainer password
const resetTrainerPassword = asyncHandler(
  async (req, res) => {
    const { trainerId } = req.params;

    const validatedData =
      trainerResetPasswordSchema.parse(req.body);

    await resetTrainerPasswordService(
      trainerId,
      validatedData.newPassword,
      req.user
    );

    return successResponse(
      res,
      null,
      "Trainer password reset successfully."
    );
  }
);
export {
  loginTrainer,
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  softDeleteTrainer,
  getTrainerProfile,
  updateTrainerProfile,
  changeTrainerPassword,
  resetTrainerPassword,
};