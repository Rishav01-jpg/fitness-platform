import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createClientSchema,
  updateClientSchema,
} from "./client.validation.js";

import {
  createClientService,
  getAllClientsService,
  getClientByIdService,
  updateClientService,
  softDeleteClientService,
} from "./client.service.js";

const createClient = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData =
    createClientSchema.parse(req.body);

  // Create client
  const client =
    await createClientService(
      validatedData,
      req.user
    );

  return successResponse(
    res,
    client,
    "Client created successfully.",
    201
  );
});

//get all clients
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await getAllClientsService(req.user);

  return successResponse(
    res,
    clients,
    "Clients fetched successfully."
  );
});

//get clients by id
const getClientById = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const client = await getClientByIdService(
    clientId,
    req.user
  );

  return successResponse(
    res,
    client,
    "Client fetched successfully."
  );
});

//update client
const updateClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const validatedData =
    updateClientSchema.parse(req.body);

  const client =
    await updateClientService(
      clientId,
      validatedData,
      req.user
    );

  return successResponse(
    res,
    client,
    "Client updated successfully."
  );
});

//soft delete client
const softDeleteClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const client =
    await softDeleteClientService(
      clientId,
      req.user
    );

  return successResponse(
    res,
    client,
    "Client deactivated successfully."
  );
});

export {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  softDeleteClient,
};