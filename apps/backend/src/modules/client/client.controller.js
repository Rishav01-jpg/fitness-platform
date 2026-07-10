import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createClientSchema,
} from "./client.validation.js";

import {
  createClientService,
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

export {
  createClient,
};