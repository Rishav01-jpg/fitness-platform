import AppError from "../shared/errors/AppError.js";
import Tenant from "../modules/tenant/tenant.model.js";
import Subscription from "../modules/subscription/subscription.model.js";

const checkSubscription = async (req, res, next) => {
  try {
    // Super Admin bypasses subscription checks
    if (req.user.role === "superAdmin") {
      return next();
    }

    const tenant = await Tenant.findById(req.user.tenantId);

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    const subscription = await Subscription.findById(
      tenant.subscription
    );

    if (!subscription) {
      return next(new AppError("Subscription not found.", 404));
    }

    if (subscription.status !== "ACTIVE") {
      return next(
        new AppError(
          "Your subscription is not active.",
          403
        )
      );
    }

    if (new Date(subscription.endDate) < new Date()) {
      return next(
        new AppError(
          "Your subscription has expired. Please renew your plan.",
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkSubscription;