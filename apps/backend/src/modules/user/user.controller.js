import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./user.validation.js";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserByIdService,
} from "./user.service.js";
import { getUsersService } from "./user.service.js";

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



const login = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = loginSchema.parse(req.body);

  // Login user
  const result = await loginUser(validatedData);

  return successResponse(
    res,
    result,
    "Login successful",
    200
  );
});

//
// Get Logged-in User Profile
//
const profile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user._id);

  return successResponse(
    res,
    user,
    "Profile fetched successfully"
  );
});

//
// Update Logged-in User Profile
//
const updateProfileController = asyncHandler(
  async (req, res) => {
    // Validate request
    const validatedData =
      updateProfileSchema.parse(req.body);

    // Update profile
    const user = await updateProfile(
      req.user._id,
      validatedData
    );

    return successResponse(
      res,
      user,
      "Profile updated successfully"
    );
  }
);

//
// Change Password
//
const changePasswordController =
  asyncHandler(async (req, res) => {
    // Validate request
    const validatedData =
      changePasswordSchema.parse(req.body);

    // Change password
    await changePassword(
      req.user._id,
      validatedData
    );

    return successResponse(
      res,
      null,
      "Password changed successfully"
    );
  });

  //
// Forgot Password
//
const forgotPasswordController =
  asyncHandler(async (req, res) => {
    // Validate request
    const validatedData =
      forgotPasswordSchema.parse(req.body);

    // Send reset email
    await forgotPassword(validatedData.email);

    return successResponse(
      res,
      null,
      "Password reset email sent successfully."
    );
  });

  const resetPasswordController = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = resetPasswordSchema.parse(req.body);

  // Reset password
  const result = await resetPassword(
    validatedData.token,
    validatedData.newPassword
  );

  return successResponse(
    res,
    null,
    result.message,
    200
  );
});

const getUsersController = asyncHandler(async (req, res) => {
  const result = await getUsersService(req.user, req.query);

 return successResponse(
  res,
  result,
  "Users fetched successfully"
);
});

const getUserByIdController = asyncHandler(
  async (req, res) => {
    const user = await getUserByIdService(
      req.user,
      req.params.userId
    );

    return successResponse(
      res,
      user,
      "User fetched successfully.",
      200
    );
  }
);

export {
  register,
  login,
  profile,
  updateProfileController,
  changePasswordController,
  forgotPasswordController,
   resetPasswordController,
   getUsersController,
   getUserByIdController,
};