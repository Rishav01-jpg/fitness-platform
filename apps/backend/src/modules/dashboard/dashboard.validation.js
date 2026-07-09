import { z } from "zod";

export const createDashboardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Dashboard name must be at least 3 characters.")
    .max(100, "Dashboard name cannot exceed 100 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Dashboard code is required.")
    .max(20, "Dashboard code cannot exceed 20 characters.")
    .transform((value) => value.toUpperCase()),

  address: z.string().trim().optional(),

  city: z.string().trim().optional(),

  state: z.string().trim().optional(),

  country: z.string().trim().optional(),

  phone: z.string().trim().optional(),

  email: z
    .email("Invalid email address.")
    .trim()
    .toLowerCase()
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateDashboardSchema =
  createDashboardSchema.partial();