import { z } from "zod";

export const createIndividualSchema = z.object({
  fullName: z.string().trim().min(2),

  gender: z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
  ]),

  dateOfBirth: z.coerce.date(),

  phone: z.string().trim().optional(),

  email: z.string().email(),

  height: z.number().positive(),

  weight: z.number().positive(),

  fitnessGoal: z.enum([
    "WEIGHT_LOSS",
    "WEIGHT_GAIN",
    "MUSCLE_GAIN",
    "MAINTENANCE",
  ]),

  activityLevel: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),

  profileImage: z.string().optional(),

  goalTarget: z.number().positive().optional(),
});

export const updateIndividualSchema =
  createIndividualSchema.partial();