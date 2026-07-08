import AppError from "../shared/errors/AppError.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access denied. Insufficient permissions.",
          403
        )
      );
    }

    next();
  };
};

export default authorize;