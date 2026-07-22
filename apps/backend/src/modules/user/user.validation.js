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

  export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),

  newPassword: z.string().min(8),
});

  export const loginSchema = z
  .object({
    email: z.string().email().optional(),

    phone: z.string().min(10).max(15).optional(),

    password: z.string().min(8),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required.",
    path: ["email"],
  });

  export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),

  lastName: z.string().min(2).max(50).optional(),

  phone: z.string().min(10).max(15).optional(),

  profileImage: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),

  newPassword: z.string().min(8),

});

