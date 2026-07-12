import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";
import Trainer from "../trainer/trainer.model.js";
import Client from "../client/client.model.js";
import Membership from "../membership/membership.model.js";

import {
  createWorkout,
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

export {
  createWorkoutService,
};