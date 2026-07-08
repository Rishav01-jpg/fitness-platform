import AppError from "../shared/errors/AppError.js";

const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const userPermissions = req.user.permissions || [];

    const hasRequiredPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermission) {
      return next(
        new AppError(
          "Access denied. Required permission not found.",
          403
        )
      );
    }

    next();
  };
};

export default hasPermission;