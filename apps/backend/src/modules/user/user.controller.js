import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";
import { registerSchema } from "./user.validation.js";
import { registerUser } from "./user.service.js";

const register = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = registerSchema.parse(req.body);

  // Register user
  const user = await registerUser(validatedData);

  // Convert mongoose document to plain object
  const userObject = user.toObject();

  // Remove password before sending response
  delete userObject.password;

  return successResponse(
    res,
    userObject,
    "User registered successfully",
    201
  );
});

export { register };