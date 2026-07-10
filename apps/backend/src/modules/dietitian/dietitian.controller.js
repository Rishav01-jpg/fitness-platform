import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createDietitianSchema,
  updateDietitianSchema,
} from "./dietitian.validation.js";

import {
  createDietitianService,
  getAllDietitiansService,
  getDietitianByIdService,
  updateDietitianService,
  softDeleteDietitianService,
} from "./dietitian.service.js";

const createDietitian = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData =
    createDietitianSchema.parse(req.body);

  // Create dietitian
  const dietitian =
    await createDietitianService(
      validatedData,
      req.user
    );

  return successResponse(
    res,
    dietitian,
    "Dietitian created successfully.",
    201
  );
});

//get all dietitians
const getAllDietitians = asyncHandler(async (req, res) => {
  const dietitians = await getAllDietitiansService(req.user);

  return successResponse(
    res,
    dietitians,
    "Dietitians fetched successfully."
  );
});

//get dietition by id
const getDietitianById = asyncHandler(async (req, res) => {
  const { dietitianId } = req.params;

  const dietitian = await getDietitianByIdService(
    dietitianId,
    req.user
  );

  return successResponse(
    res,
    dietitian,
    "Dietitian fetched successfully."
  );
});

//update dietitian
const updateDietitian = asyncHandler(async (req, res) => {
  const { dietitianId } = req.params;

  const validatedData =
    updateDietitianSchema.parse(req.body);

  const dietitian =
    await updateDietitianService(
      dietitianId,
      validatedData,
      req.user
    );

  return successResponse(
    res,
    dietitian,
    "Dietitian updated successfully."
  );
});

//soft delete dietitian
const softDeleteDietitian = asyncHandler(async (req, res) => {
  const { dietitianId } = req.params;

  const dietitian =
    await softDeleteDietitianService(
      dietitianId,
      req.user
    );

  return successResponse(
    res,
    dietitian,
    "Dietitian deactivated successfully."
  );
});

export {
  createDietitian,
  getAllDietitians,
  getDietitianById,
  updateDietitian,
  softDeleteDietitian,
};