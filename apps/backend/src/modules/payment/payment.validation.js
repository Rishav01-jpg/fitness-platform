import { z } from "zod";

export const createPaymentSchema = z.object({
  client: z.string().min(1),

  membership: z.string().min(1),

  amount: z.number().nonnegative(),

  discount: z.number().nonnegative().optional(),

  tax: z.number().nonnegative().optional(),

  paidAmount: z.number().nonnegative().optional(),

  paymentMethod: z.enum([
    "CASH",
    "UPI",
    "CARD",
    "BANK_TRANSFER",
  ]),

  paymentStatus: z
    .enum([
      "PENDING",
      "PAID",
      "PARTIAL",
      "FAILED",
    ])
    .optional(),

  transactionId: z.string().trim().optional(),

  paidDate: z.coerce.date().optional(),

  dueDate: z.coerce.date(),

  notes: z.string().trim().optional(),
});

export const updatePaymentSchema =
  createPaymentSchema.partial();