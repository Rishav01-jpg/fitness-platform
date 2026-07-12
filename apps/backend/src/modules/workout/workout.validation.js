import { z } from "zod";

export const createWorkoutSchema = z.object({
  dashboard: z.string().min(1, "Dashboard is required."),

  trainer: z.string().min(1, "Trainer is required."),

  client: z.string().min(1, "Client is required."),

  title: z
    .string()
    .trim()
    .min(2, "Workout title must be at least 2 characters.")
    .max(100, "Workout title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .optional(),

  goal: z
    .enum([
      "WEIGHT_LOSS",
      "MUSCLE_GAIN",
      "STRENGTH",
      "ENDURANCE",
      "GENERAL_FITNESS",
    ])
    .optional(),

  durationInWeeks: z
    .number()
    .min(1, "Duration must be at least 1 week."),

  notes: z
    .string()
    .trim()
    .optional(),
});

export const updateWorkoutSchema =
  createWorkoutSchema.partial();