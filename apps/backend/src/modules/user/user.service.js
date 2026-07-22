import bcrypt from "bcrypt";
import User from "./user.model.js";
import AppError from "../../shared/errors/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import crypto from "crypto";
import { sendEmail } from "../../shared/services/email.service.js";
import { ROLES } from "../../constants/roles.js";

import {
  findUserById,
  findUsers,
  countUsers,
} from "./user.repository.js";


const registerUser = async (userData) => {
  const { email, phone, password } = userData;

  // Check email
  if (email) {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }
  }

  // Check phone
  if (phone) {
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      throw new AppError("Phone number already exists", 409);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

// Login User
const loginUser = async (loginData) => {
  const { email, phone, password } = loginData;

  let user;

  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ phone });
  }

  if (!user) {
    throw new AppError("Invalid email/phone or password", 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid email/phone or password", 401);
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    tenantId: user.tenantId,
    dashboardId: user.dashboardId,
  });

  const userObject = user.toObject();

  delete userObject.password;

  return {
    user: userObject,
    token,
  };
};
//
// Get Logged-in User Profile
//
const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

//
// Update Logged-in User Profile
//
const updateProfile = async (
  userId,
  updateData
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Update only provided fields
  if (updateData.firstName !== undefined) {
    user.firstName = updateData.firstName;
  }

  if (updateData.lastName !== undefined) {
    user.lastName = updateData.lastName;
  }

  if (updateData.phone !== undefined) {
    user.phone = updateData.phone;
  }

  if (updateData.profileImage !== undefined) {
    user.profileImage =
      updateData.profileImage;
  }

  await user.save();

  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

//
// Change Password
//
const changePassword = async (
  userId,
  passwordData
) => {
  const {
    currentPassword,
    newPassword,
  } = passwordData;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Verify current password
  const isPasswordMatch =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!isPasswordMatch) {
    throw new AppError(
      "Current password is incorrect.",
      400
    );
  }

  // Hash new password
  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  await user.save();

  return;
};

//
// Forgot Password
//
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      "No account found with this email.",
      404
    );
  }

  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save hashed token
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token valid for 15 minutes
  user.resetPasswordExpires =
    new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  // Reset link (development)
const resetUrl =
  `http://localhost:5173/reset-password?token=${resetToken}`;

  // Email
  await sendEmail({
  to: user.email,
  subject: "Reset Your Password",
  html: `
    <h2>Password Reset Request</h2>

    <p>Hello ${user.firstName},</p>

    <p>You requested to reset your password.</p>

    <hr/>

    <h3>Reset Link</h3>

    <p>
      <a href="${resetUrl}">
        Click here to reset your password
      </a>
    </p>

    <hr/>

    <h3>Reset Token (Development)</h3>

    <p>Copy this token and use it in Hoppscotch:</p>

    <div style="
      background:#f4f4f4;
      padding:15px;
      border-radius:5px;
      font-family:monospace;
      word-break:break-all;
    ">
      ${resetToken}
    </div>

    <hr/>

    <p>This token expires in <strong>15 minutes</strong>.</p>

    <p>If you didn't request this email, you can ignore it.</p>
  `,
});

  return;
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    message: "Password reset successfully",
  };
};

const getUsersService = async (loggedInUser, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search?.trim();

  const skip = (page - 1) * limit;

  let filter = {};

  // SUPER ADMIN
  if (loggedInUser.role === ROLES.SUPER_ADMIN) {
    // no extra filter
  }

  // ADMIN
  else if (loggedInUser.role === ROLES.ADMIN) {
    filter.tenantId = loggedInUser.tenantId;

    filter.role = {
      $in: [
        ROLES.TRAINER,
        ROLES.DIETITIAN,
        ROLES.CLIENT,
      ],
    };
  }

  // Everyone else
  else {
    throw new AppError(
      "You are not authorized to view users.",
      403
    );
  }

  // Search
  if (search) {
    filter.$or = [
      {
        firstName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const users = await findUsers(filter, {
    skip,
    limit,
  });

  const total = await countUsers(filter);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getUserByIdService = async (
  loggedInUser,
  userId
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // SUPER ADMIN
  if (loggedInUser.role === ROLES.SUPER_ADMIN) {
    return user;
  }

  // ADMIN
  if (loggedInUser.role === ROLES.ADMIN) {
    // Must belong to same tenant
    if (
      user.tenantId?.toString() !==
      loggedInUser.tenantId?.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }

    // Can view only Trainer, Dietitian and Client
    if (
      ![
        ROLES.TRAINER,
        ROLES.DIETITIAN,
        ROLES.CLIENT,
      ].includes(user.role)
    ) {
      throw new AppError("Access denied.", 403);
    }

    return user;
  }

  throw new AppError(
    "You are not authorized to view users.",
    403
  );
};
export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
   resetPassword,
   getUsersService,
     getUserByIdService,
};