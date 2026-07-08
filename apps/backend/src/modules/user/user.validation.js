import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2).max(50),

    lastName: z.string().min(2).max(50),

    email: z.string().email().optional(),

    phone: z.string().min(10).max(15).optional(),

    password: z.string().min(8),

    role: z.optional(z.string()),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required.",
    path: ["email"],
  });