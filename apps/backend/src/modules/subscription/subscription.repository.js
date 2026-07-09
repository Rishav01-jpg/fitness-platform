import Subscription from "./subscription.model.js";

// Create subscription
const createSubscription = async (subscriptionData) => {
  return await Subscription.create(subscriptionData);
};

// Find by ID
const findSubscriptionById = async (subscriptionId) => {
  return await Subscription.findById(subscriptionId);
};

// Find active subscription for a tenant
const findActiveSubscriptionByTenant = async (tenantId) => {
  return await Subscription.findOne({
    tenant: tenantId,
    status: "ACTIVE",
  });
};

// Find all subscriptions
const findAllSubscriptions = async () => {
  return await Subscription.find();
};

// Update subscription
const updateSubscription = async (
  subscriptionId,
  updateData
) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createSubscription,
  findSubscriptionById,
  findActiveSubscriptionByTenant,
  findAllSubscriptions,
  updateSubscription,
};