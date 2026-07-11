import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";
import Trainer from "../trainer/trainer.model.js";
import Dietitian from "../dietitian/dietitian.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createClient,
  findClientById,
  findClientByEmail,
  findClientByPhone,
  findAllClients,
  findClientsByTenant,
  updateClient,
  softDeleteClient,
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

//get all clients
const getAllClientsService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllClients();
  }

  // Tenant Admin
  return await findClientsByTenant(user.tenantId);
};

//get clients by id
const getClientByIdService = async (
  clientId,
  user
) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Super Admin can access everything
  if (user.role === ROLES.SUPER_ADMIN) {
    return client;
  }

  // Tenant Admin can access only own clients
  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return client;
};

//update client
const updateClientService = async (
  clientId,
  updateData,
  user
) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Super Admin can update any client
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      client.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Validate dashboard (if updating)
  if (updateData.dashboard) {
    const dashboard = await Dashboard.findById(
      updateData.dashboard
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
  }

  // Validate trainer (if updating)
  if (updateData.trainer) {
    const trainer = await Trainer.findById(
      updateData.trainer
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

  // Validate dietitian (if updating)
  if (updateData.dietitian) {
    const dietitian = await Dietitian.findById(
      updateData.dietitian
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

  // Duplicate email
  if (
    updateData.email &&
    updateData.email !== client.email
  ) {
    const existingEmail = await findClientByEmail(
      updateData.email
    );

    if (existingEmail) {
      throw new AppError(
        "Client email already exists.",
        409
      );
    }
  }

  // Duplicate phone
  if (
    updateData.phone &&
    updateData.phone !== client.phone
  ) {
    const existingPhone = await findClientByPhone(
      updateData.phone
    );

    if (existingPhone) {
      throw new AppError(
        "Client phone already exists.",
        409
      );
    }
  }

  return await updateClient(
    clientId,
    updateData
  );
};

//soft delete client
const softDeleteClientService = async (
  clientId,
  user
) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Super Admin can delete any client
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      client.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteClient(clientId);
};

export {
  createClientService,
  getAllClientsService,
  getClientByIdService,
  updateClientService,
  softDeleteClientService,
};