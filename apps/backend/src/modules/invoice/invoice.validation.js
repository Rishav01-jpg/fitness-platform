import { z } from "zod";

export const createInvoiceSchema = z.object({
  client: z.string().min(1),

  membership: z.string().min(1),

  amount: z.number().nonnegative(),

  discount: z.number().nonnegative().optional(),

  tax: z.number().nonnegative().optional(),

  issueDate: z.coerce.date(),

  dueDate: z.coerce.date(),

  notes: z.string().trim().optional(),
});

export const updateInvoiceSchema =
  createInvoiceSchema.partial();