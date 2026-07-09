import { z } from "zod";

export const createTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tenant name must be at least 3 characters.")
    .max(100, "Tenant name cannot exceed 100 characters."),

  email: z
    .email("Invalid email address.")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits."),

  owner: z.string().min(1, "Owner is required."),

  plan: z.string().min(1, "Plan is required."),

  address: z.string().trim().optional(),

  city: z.string().trim().optional(),

  state: z.string().trim().optional(),

  country: z.string().trim().optional(),

  pincode: z.string().trim().optional(),

  timezone: z.string().trim().optional(),

  currency: z.string().trim().optional(),

  logo: z.string().trim().optional(),
});

export const updateTenantSchema = createTenantSchema.partial();