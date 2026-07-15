import { z } from "zod";

export const createProgressSchema = z.object({
  client: z.string().min(1),

  trainer: z.string().min(1),

  weight: z.number().positive(),

  height: z.number().positive(),

  bodyFat: z.number().min(0).max(100).optional(),

  chest: z.number().positive().optional(),

  waist: z.number().positive().optional(),

  hips: z.number().positive().optional(),

  biceps: z.number().positive().optional(),

  thigh: z.number().positive().optional(),

  shoulder: z.number().positive().optional(),

  neck: z.number().positive().optional(),

  notes: z.string().trim().optional(),

  recordedDate: z.coerce.date(),
});

export const updateProgressSchema =
  createProgressSchema.partial();