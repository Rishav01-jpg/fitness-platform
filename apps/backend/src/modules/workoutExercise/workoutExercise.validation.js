import { z } from "zod";

export const createWorkoutExerciseSchema = z.object({
  workout: z.string().min(1),

  exercise: z.string().min(1),

  sets: z.number().min(1),

  reps: z.number().min(1),

  weight: z.number().min(0).optional(),

  restTimeInSeconds: z.number().min(0).optional(),

  exerciseOrder: z.number().min(1),

  notes: z.string().trim().optional(),
});

export const updateWorkoutExerciseSchema =
  createWorkoutExerciseSchema.partial();