import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import AppError from "../shared/errors/AppError.js";
import User from "../modules/user/user.model.js";
import { STATUS } from "../constants/status.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (user.status !== STATUS.ACTIVE) {
      return next(new AppError("Account is inactive", 403));
    }

   const userObject = user.toObject();

// Remove sensitive fields
delete userObject.password;
delete userObject.__v;

// Attach permissions
userObject.permissions =
  ROLE_PERMISSIONS[user.role] || [];

req.user = userObject;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authenticate;