import AppError from "../../shared/errors/AppError.js";

import Tenant from "../tenant/tenant.model.js";
import Plan from "../plan/plan.model.js";

import {
  createSubscription,
  findActiveSubscriptionByTenant,
} from "./subscription.repository.js";

const createSubscriptionService = async (subscriptionData) => {
  // Check tenant
  const tenant = await Tenant.findById(subscriptionData.tenant);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  // Check plan
  const plan = await Plan.findById(subscriptionData.plan);

  if (!plan) {
    throw new AppError("Plan not found.", 404);
  }

  // Prevent duplicate active subscriptions
  const existingSubscription =
    await findActiveSubscriptionByTenant(
      subscriptionData.tenant
    );

  if (existingSubscription) {
    throw new AppError(
      "Tenant already has an active subscription.",
      409
    );
  }

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date(startDate);

 switch (plan.billingCycle) {
  case "YEARLY":
    endDate.setFullYear(endDate.getFullYear() + 1);
    break;

  default:
    throw new AppError("Invalid billing cycle.", 400);
}

  // Create subscription
  const subscription = await createSubscription({
    ...subscriptionData,
    startDate,
    endDate,
    status: "ACTIVE",
  });

  // Link subscription to tenant
  tenant.subscription = subscription._id;
  await tenant.save();

  return subscription;
};

export {
  createSubscriptionService,
};