import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";
import Trainer from "../trainer/trainer.model.js";
import Client from "../client/client.model.js";
import Membership from "../membership/membership.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createWorkout,
  findWorkoutById,
  findAllWorkouts,
  findWorkoutsByTenant,
  updateWorkout,
  softDeleteWorkout,
} from "./workout.repository.js";

const createWorkoutService = async (
  workoutData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    workoutData.dashboard
  );

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Check trainer
  const trainer = await Trainer.findById(
    workoutData.trainer
  );

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  if (
    trainer.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError(
      "Trainer does not belong to your tenant.",
      403
    );
  }

  // Check client
  const client = await Client.findById(
    workoutData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Check active membership
  const membership = await Membership.findOne({
    client: workoutData.client,
    status: "ACTIVE",
  });

  if (!membership) {
    throw new AppError(
      "Client does not have an active membership.",
      400
    );
  }

  return await createWorkout({
    ...workoutData,
    tenant: user.tenantId,
  });
};

//get all workouts 
const getAllWorkoutsService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllWorkouts();
  }

  // Tenant Admin
  return await findWorkoutsByTenant(user.tenantId);
};

//get workout by id
const getWorkoutByIdService = async (
  workoutId,
  user
) => {
  const workout = await findWorkoutById(workoutId);

  if (!workout) {
    throw new AppError("Workout not found.", 404);
  }

  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return workout;
  }

  // Tenant Admin
  if (
    workout.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return workout;
};

//update workouts
const updateWorkoutService = async (
  workoutId,
  updateData,
  user
) => {
  const workout = await findWorkoutById(workoutId);

  if (!workout) {
    throw new AppError("Workout not found.", 404);
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    workout.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Validate dashboard
  if (updateData.dashboard) {
    const dashboard = await Dashboard.findById(updateData.dashboard);

    if (!dashboard) {
      throw new AppError("Dashboard not found.", 404);
    }

    if (
      dashboard.tenant.toString() !== workout.tenant.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Validate trainer
  if (updateData.trainer) {
    const trainer = await Trainer.findById(updateData.trainer);

    if (!trainer) {
      throw new AppError("Trainer not found.", 404);
    }

    if (
      trainer.tenant.toString() !== workout.tenant.toString()
    ) {
      throw new AppError(
        "Trainer does not belong to your tenant.",
        403
      );
    }
  }

  // Validate client
  if (updateData.client) {
    const client = await Client.findById(updateData.client);

    if (!client) {
      throw new AppError("Client not found.", 404);
    }

    if (
      client.tenant.toString() !== workout.tenant.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }

    const membership = await Membership.findOne({
      client: updateData.client,
      status: "ACTIVE",
    });

    if (!membership) {
      throw new AppError(
        "Client does not have an active membership.",
        400
      );
    }
  }

  return await updateWorkout(workoutId, updateData);
};

//SOFT DELETE WORKOUT
const deleteWorkoutService = async (
  workoutId,
  user
) => {
  const workout = await findWorkoutById(workoutId);

  if (!workout) {
    throw new AppError("Workout not found.", 404);
  }

  // Super Admin can delete any workout
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      workout.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteWorkout(workoutId);
};

export {
  createWorkoutService,
  getAllWorkoutsService,
  getWorkoutByIdService,
  updateWorkoutService,
  deleteWorkoutService,
};