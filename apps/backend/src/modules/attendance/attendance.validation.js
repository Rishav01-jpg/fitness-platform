import { z } from "zod";

export const createAttendanceSchema = z.object({
  client: z.string().min(1),

  trainer: z.string().min(1),

  membership: z.string().min(1),

  workout: z.string().optional(),

  attendanceDate: z.coerce.date(),

  checkIn: z.coerce.date(),

  checkOut: z.coerce.date().optional(),

  attendanceStatus: z
    .enum([
      "PRESENT",
      "ABSENT",
      "LATE",
      "LEAVE",
    ])
    .optional(),

  notes: z.string().trim().optional(),
});

export const updateAttendanceSchema =
  createAttendanceSchema.partial();