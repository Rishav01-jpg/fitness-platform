import { z } from "zod";

export const createTrainerSchema = z.object({
  dashboard: z.string().min(1, "Dashboard is required."),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .optional(),

  email: z
    .email("Invalid email address.")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits."),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .optional(),

  specialization: z
    .string()
    .trim()
    .optional(),

  experience: z
    .number()
    .min(0)
    .optional(),

  salary: z
    .number()
    .min(0)
    .optional(),

  profileImage: z
    .string()
    .trim()
    .optional(),
});

export const updateTrainerSchema =
  createTrainerSchema.partial();