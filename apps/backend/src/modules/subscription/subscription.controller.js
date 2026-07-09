import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import { createSubscriptionSchema } from "./subscription.validation.js";
import { createSubscriptionService } from "./subscription.service.js";

const createSubscription = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = createSubscriptionSchema.parse(req.body);

  // Create subscription
  const subscription = await createSubscriptionService(
    validatedData
  );

  return successResponse(
    res,
    subscription,
    "Subscription created successfully.",
    201
  );
});

export {
  createSubscription,
};