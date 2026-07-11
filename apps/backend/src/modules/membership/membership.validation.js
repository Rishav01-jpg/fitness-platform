import { z } from "zod";

export const createMembershipSchema = z.object({
  dashboard: z.string().min(1, "Dashboard is required."),

  client: z.string().min(1, "Client is required."),

  name: z
    .string()
    .trim()
    .min(2, "Membership name must be at least 2 characters.")
    .max(100, "Membership name cannot exceed 100 characters."),

  duration: z
    .number()
    .min(1, "Duration must be at least 1."),

  durationType: z.enum(["DAY", "MONTH", "YEAR"]),

  amount: z
    .number()
    .min(0, "Amount cannot be negative."),

  startDate: z
    .string()
    .datetime()
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
});

export const updateMembershipSchema =
  createMembershipSchema.partial();