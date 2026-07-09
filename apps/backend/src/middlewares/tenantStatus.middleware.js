import AppError from "../shared/errors/AppError.js";
import Tenant from "../modules/tenant/tenant.model.js";

const checkTenantStatus = async (req, res, next) => {
  try {
    // Super Admin bypasses this check
    if (req.user.role === "superAdmin") {
      return next();
    }

    // Individual users don't belong to a tenant
    if (!req.user.tenantId) {
      return next();
    }

    const tenant = await Tenant.findById(req.user.tenantId);

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    if (tenant.status !== "active") {
      return next(
        new AppError(
          "Tenant is inactive. Please contact the Super Admin.",
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkTenantStatus;