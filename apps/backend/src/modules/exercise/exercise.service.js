import AppError from "../../shared/errors/AppError.js";
import { ROLES } from "../../constants/roles.js";

import {
  createExercise,
  findExerciseByName,
  findAllExercises,
  findExercisesByTenant,
  findExerciseById,
  updateExercise,
  softDeleteExercise,
} from "./exercise.repository.js";

const createExerciseService = async (
  exerciseData,
  user
) => {
  // Only Tenant Admin
  if (user.role !== ROLES.ADMIN) {
    throw new AppError(
      "Only gym admin can manage the exercise library.",
      403
    );
  }

  // Duplicate name check
  const existingExercise =
    await findExerciseByName(
      user.tenantId,
      exerciseData.name
    );

  if (existingExercise) {
    throw new AppError(
      "Exercise already exists.",
      409
    );
  }

  return await createExercise({
    ...exerciseData,
    tenant: user.tenantId,
  });
};

//get all exercises
const getAllExercisesService = async (user) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllExercises();
  }

  return await findExercisesByTenant(user.tenantId);
};

//get exercise by id
const getExerciseByIdService = async (
  exerciseId,
  user
) => {
  const exercise = await findExerciseById(exerciseId);

  if (!exercise) {
    throw new AppError("Exercise not found.", 404);
  }

  if (user.role === ROLES.SUPER_ADMIN) {
    return exercise;
  }

  if (
    exercise.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return exercise;
};
//update exercise
const updateExerciseService = async (
  exerciseId,
  updateData,
  user
) => {
  const exercise = await findExerciseById(exerciseId);

  if (!exercise) {
    throw new AppError("Exercise not found.", 404);
  }

  // Tenant Isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    exercise.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Duplicate Name Check
  if (
    updateData.name &&
    updateData.name.toLowerCase() !==
      exercise.name.toLowerCase()
  ) {
    const existingExercise =
      await findExerciseByName(
        exercise.tenant,
        updateData.name
      );

    if (existingExercise) {
      throw new AppError(
        "Exercise already exists.",
        409
      );
    }
  }

  return await updateExercise(
    exerciseId,
    updateData
  );
};

//soft delete exercise
const deleteExerciseService = async (
  exerciseId,
  user
) => {
  const exercise = await findExerciseById(exerciseId);

  if (!exercise) {
    throw new AppError("Exercise not found.", 404);
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    exercise.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return await softDeleteExercise(exerciseId);
};

export {
  createExerciseService,
  getAllExercisesService,
  getExerciseByIdService,
  updateExerciseService,
  deleteExerciseService,
};