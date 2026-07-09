import { z } from "zod";

export const createSubscriptionSchema = z.object({
  tenant: z.string().min(1, "Tenant is required."),

  plan: z.string().min(1, "Plan is required."),

  autoRenew: z.boolean().optional(),

  paymentReference: z.string().trim().optional(),
});