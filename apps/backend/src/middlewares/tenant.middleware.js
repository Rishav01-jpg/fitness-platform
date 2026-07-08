import AppError from "../shared/errors/AppError.js";

const tenantAccess = (req, res, next) => {
  // Super Admin can access everything
  if (req.user.role === "superAdmin") {
    return next();
  }

  const tenantId =
    req.params.tenantId ||
    req.body.tenantId ||
    req.query.tenantId;

  if (!tenantId) {
    return next(new AppError("Tenant ID is required.", 400));
  }

  if (String(req.user.tenantId) !== String(tenantId)) {
    return next(
      new AppError(
        "Access denied. You cannot access another tenant's data.",
        403
      )
    );
  }

  next();
};

export default tenantAccess;