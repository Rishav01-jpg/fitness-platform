import AppError from "../shared/errors/AppError.js";

const dashboardAccess = (req, res, next) => {
  // Super Admin can access everything
  if (req.user.role === "superAdmin") {
    return next();
  }

  // Admin can access all dashboards inside their tenant
  if (req.user.role === "admin") {
    return next();
  }

  const dashboardId =
    req.params.dashboardId ||
    req.body.dashboardId ||
    req.query.dashboardId;

  if (!dashboardId) {
    return next(new AppError("Dashboard ID is required.", 400));
  }

  if (String(req.user.dashboardId) !== String(dashboardId)) {
    return next(
      new AppError(
        "Access denied. You cannot access another dashboard.",
        403
      )
    );
  }

  next();
};

export default dashboardAccess;