import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";
import Trainer from "../trainer/trainer.model.js";
import Dietitian from "../dietitian/dietitian.model.js";

import {
  createClient,
  findClientByEmail,
  findClientByPhone,
} from "./client.repository.js";

const createClientService = async (
  clientData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    clientData.dashboard
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

  // Check trainer (optional)
  if (clientData.trainer) {
    const trainer = await Trainer.findById(
      clientData.trainer
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
  }

  // Check dietitian (optional)
  if (clientData.dietitian) {
    const dietitian = await Dietitian.findById(
      clientData.dietitian
    );

    if (!dietitian) {
      throw new AppError("Dietitian not found.", 404);
    }

    if (
      dietitian.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError(
        "Dietitian does not belong to your tenant.",
        403
      );
    }
  }

  // Duplicate email (optional)
  if (clientData.email) {
    const existingEmail = await findClientByEmail(
      clientData.email
    );

    if (existingEmail) {
      throw new AppError(
        "Client email already exists.",
        409
      );
    }
  }

  // Duplicate phone
  const existingPhone = await findClientByPhone(
    clientData.phone
  );

  if (existingPhone) {
    throw new AppError(
      "Client phone already exists.",
      409
    );
  }

  // Create client
  return await createClient({
    ...clientData,
    tenant: user.tenantId,
  });
};

export {
  createClientService,
};