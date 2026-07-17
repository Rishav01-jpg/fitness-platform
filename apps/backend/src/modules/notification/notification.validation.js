import { z } from "zod";

export const createNotificationSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient is required."),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(
      150,
      "Title cannot exceed 150 characters."
    ),

  message: z
    .string()
    .trim()
    .min(2, "Message is required.")
    .max(
      1000,
      "Message cannot exceed 1000 characters."
    ),

  type: z.enum([
    "GENERAL",
    "MEMBERSHIP",
    "PAYMENT",
    "INVOICE",
    "ATTENDANCE",
    "WORKOUT",
    "PROGRESS",
    "SUBSCRIPTION",
    "SYSTEM",
  ]),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),

  channel: z.enum([
    "IN_APP",
    "EMAIL",
    "BOTH",
  ]),

  actionUrl: z
    .string()
    .trim()
    .optional(),

  metadata: z
    .record(z.any())
    .optional(),
});

export const updateNotificationSchema =
  createNotificationSchema.partial();