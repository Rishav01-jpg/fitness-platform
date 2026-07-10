import { z } from "zod";

export const createClientSchema = z.object({
  dashboard: z.string().min(1, "Dashboard is required."),

  trainer: z.string().optional(),

  dietitian: z.string().optional(),

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
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits."),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .optional(),

  dateOfBirth: z
    .string()
    .datetime()
    .optional(),

  height: z
    .number()
    .min(0)
    .optional(),

  weight: z
    .number()
    .min(0)
    .optional(),

  address: z
    .string()
    .trim()
    .optional(),

  emergencyContactName: z
    .string()
    .trim()
    .optional(),

  emergencyContactPhone: z
    .string()
    .trim()
    .optional(),

  medicalConditions: z
    .string()
    .trim()
    .optional(),

  profileImage: z
    .string()
    .trim()
    .optional(),
});

export const updateClientSchema =
  createClientSchema.partial();