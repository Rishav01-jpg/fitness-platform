import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createProgressSchema,
  updateProgressSchema,
} from "./progress.validation.js";

import {
  createProgressService,
  getAllProgressService,
  getProgressByIdService,
  updateProgressService,
  deleteProgressService,
} from "./progress.service.js";

const createProgress = asyncHandler(
  async (req, res) => {
    const validatedData =
      createProgressSchema.parse(req.body);

    const progress =
      await createProgressService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      progress,
      "Progress recorded successfully.",
      201
    );
  }
);

//get all progress
const getAllProgress = asyncHandler(
  async (req, res) => {
    const progress =
      await getAllProgressService(req.user);

    return successResponse(
      res,
      progress,
      "Progress records fetched successfully."
    );
  }
);

//get progress by id
const getProgressById = asyncHandler(
  async (req, res) => {
    const { progressId } = req.params;

    const progress =
      await getProgressByIdService(
        progressId,
        req.user
      );

    return successResponse(
      res,
      progress,
      "Progress record fetched successfully."
    );
  }
);

//update progresses
const updateProgress = asyncHandler(
  async (req, res) => {
    const { progressId } = req.params;

    const validatedData =
      updateProgressSchema.parse(req.body);

    const progress =
      await updateProgressService(
        progressId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      progress,
      "Progress updated successfully."
    );
  }
);

//soft delete progress 
const deleteProgress = asyncHandler(
  async (req, res) => {
    const { progressId } = req.params;

    const progress =
      await deleteProgressService(
        progressId,
        req.user
      );

    return successResponse(
      res,
      progress,
      "Progress deleted successfully."
    );
  }
);

export {
  createProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
};