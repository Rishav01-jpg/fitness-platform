import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Exercise name must be at least 2 characters.")
    .max(100, "Exercise name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .optional(),

  muscleGroup: z.enum([
    "CHEST",
    "BACK",
    "SHOULDERS",
    "BICEPS",
    "TRICEPS",
    "LEGS",
    "ABS",
    "GLUTES",
    "FULL_BODY",
    "CARDIO",
  ]),

  equipment: z
    .enum([
      "BODY_WEIGHT",
      "DUMBBELL",
      "BARBELL",
      "CABLE",
      "MACHINE",
      "KETTLEBELL",
      "RESISTANCE_BAND",
      "OTHER",
    ])
    .optional(),

  difficulty: z
    .enum([
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
    ])
    .optional(),

  exerciseType: z
    .enum([
      "STRENGTH",
      "CARDIO",
      "FLEXIBILITY",
      "MOBILITY",
    ])
    .optional(),

  instructions: z
    .string()
    .trim()
    .optional(),
});

export const updateExerciseSchema =
  createExerciseSchema.partial();