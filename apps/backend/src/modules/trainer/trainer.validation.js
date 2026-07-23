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

    password: z
  .string()
  .min(8, "Password must be at least 8 characters."),

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
  createTrainerSchema
    .omit({ password: true })
    .partial();

    export const trainerLoginSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address.")
      .trim()
      .toLowerCase()
      .optional(),

    phone: z
      .string()
      .trim()
      .min(10)
      .max(15)
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required.",
    path: ["email"],
  });

export const trainerChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const trainerResetPasswordSchema = z.object({
  newPassword: z.string().min(8),
});
export const updateTrainerProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  lastName: z
    .string()
    .trim()
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .optional(),

  profileImage: z
    .string()
    .trim()
    .optional(),
});