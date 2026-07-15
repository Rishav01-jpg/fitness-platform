import AppError from "../../shared/errors/AppError.js";
import Client from "../client/client.model.js";
import Trainer from "../trainer/trainer.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createProgress,
  findProgressById,
  findAllProgress,
  findProgressByTenant,
  updateProgress,
  softDeleteProgress,
} from "./progress.repository.js";

const createProgressService = async (
  progressData,
  user
) => {
  // Only Admin and Trainer
  if (
    user.role !== ROLES.ADMIN &&
    user.role !== ROLES.TRAINER
  ) {
    throw new AppError(
      "Only Admin and Trainer can record progress.",
      403
    );
  }

  // Client
  const client = await Client.findById(
    progressData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Trainer
  const trainer = await Trainer.findById(
    progressData.trainer
  );

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Tenant checks
  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  if (
    trainer.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Height in meters
  const heightInMeters =
    progressData.height / 100;

  const bmi = Number(
    (
      progressData.weight /
      (heightInMeters * heightInMeters)
    ).toFixed(2)
  );

  return await createProgress({
    ...progressData,
    tenant: user.tenantId,
    bmi,
  });
};

//get all progress
const getAllProgressService = async (user) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllProgress();
  }

  return await findProgressByTenant(user.tenantId);
};

//get progress by id
const getProgressByIdService = async (
  progressId,
  user
) => {
  const progress = await findProgressById(progressId);

  if (!progress) {
    throw new AppError(
      "Progress record not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    progress.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return progress;
};

//update progresses
const updateProgressService = async (
  progressId,
  updateData,
  user
) => {
  const progress = await findProgressById(progressId);

  if (!progress) {
    throw new AppError(
      "Progress record not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    progress.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Determine updated values
  const weight =
    updateData.weight ?? progress.weight;

  const height =
    updateData.height ?? progress.height;

  // Recalculate BMI if needed
  if (
    updateData.weight !== undefined ||
    updateData.height !== undefined
  ) {
    const heightInMeters = height / 100;

    updateData.bmi = Number(
      (
        weight /
        (heightInMeters * heightInMeters)
      ).toFixed(2)
    );
  }

  return await updateProgress(
    progressId,
    updateData
  );
};

//soft delete progress
const deleteProgressService = async (
  progressId,
  user
) => {
  const progress = await findProgressById(progressId);

  if (!progress) {
    throw new AppError(
      "Progress record not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    progress.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return await softDeleteProgress(progressId);
};

export {
  createProgressService,
  getAllProgressService,
  getProgressByIdService,
  updateProgressService,
  deleteProgressService,
};