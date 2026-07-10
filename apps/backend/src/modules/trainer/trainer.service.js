import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createTrainer,
  findTrainerById,
  findTrainerByEmail,
  findTrainerByPhone,
  findAllTrainers,
  findTrainersByTenant,
  updateTrainer,
  softDeleteTrainer,
} from "./trainer.repository.js";

//create trainer
const createTrainerService = async (
  trainerData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    trainerData.dashboard
  );

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Dashboard must belong to logged-in tenant
  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Duplicate email
  const existingEmail = await findTrainerByEmail(
    trainerData.email
  );

  if (existingEmail) {
    throw new AppError(
      "Trainer email already exists.",
      409
    );
  }

  // Duplicate phone
  const existingPhone = await findTrainerByPhone(
    trainerData.phone
  );

  if (existingPhone) {
    throw new AppError(
      "Trainer phone already exists.",
      409
    );
  }

  // Create trainer
  return await createTrainer({
    ...trainerData,
    tenant: user.tenantId,
  });
};

//get all trainers
const getAllTrainersService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllTrainers();
  }

  // Tenant Admin
  return await findTrainersByTenant(user.tenantId);
};

//get trainer by id
const getTrainerByIdService = async (
  trainerId,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can access everything
  if (user.role === ROLES.SUPER_ADMIN) {
    return trainer;
  }

  // Tenant Admin can access only own trainers
  if (
    trainer.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return trainer;
};


//update trainer
const updateTrainerService = async (
  trainerId,
  updateData,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can update any trainer
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      trainer.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Duplicate email
  if (
    updateData.email &&
    updateData.email !== trainer.email
  ) {
    const existingEmail = await findTrainerByEmail(
      updateData.email
    );

    if (existingEmail) {
      throw new AppError(
        "Trainer email already exists.",
        409
      );
    }
  }

  // Duplicate phone
  if (
    updateData.phone &&
    updateData.phone !== trainer.phone
  ) {
    const existingPhone = await findTrainerByPhone(
      updateData.phone
    );

    if (existingPhone) {
      throw new AppError(
        "Trainer phone already exists.",
        409
      );
    }
  }

  return await updateTrainer(
    trainerId,
    updateData
  );
};

//soft selete trainer 
const softDeleteTrainerService = async (
  trainerId,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can delete any trainer
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      trainer.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteTrainer(trainerId);
};

export {
  createTrainerService,
  getAllTrainersService,
  getTrainerByIdService,
  updateTrainerService,
  softDeleteTrainerService,
};