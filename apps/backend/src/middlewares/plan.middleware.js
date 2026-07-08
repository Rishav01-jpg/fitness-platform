import AppError from "../shared/errors/AppError.js";
import Dashboard from "../modules/dashboard/dashboard.model.js";
import Tenant from "../modules/tenant/tenant.model.js";
import Plan from "../modules/plan/plan.model.js";

const checkDashboardLimit = async (req, res, next) => {
  try {
    // Super Admin bypasses all limits
    if (req.user.role === "superAdmin") {
      return next();
    }

    const tenant = await Tenant.findById(req.user.tenantId);

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    const plan = await Plan.findById(tenant.plan);

    if (!plan) {
      return next(new AppError("Plan not found.", 404));
    }

    // Unlimited dashboards
    if (plan.unlimitedDashboards) {
      return next();
    }

    const dashboardCount = await Dashboard.countDocuments({
      tenant: tenant._id,
    });

    if (dashboardCount >= plan.dashboardLimit) {
      return next(
        new AppError(
          "Dashboard limit reached. Please upgrade your plan.",
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkDashboardLimit;