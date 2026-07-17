import { z } from "zod";

/* ============================================================
                    EXPENSE CATEGORY
============================================================ */

export const createExpenseCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required.")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  color: z
    .string()
    .trim()
    .optional(),

  icon: z
    .string()
    .trim()
    .optional(),
});

export const updateExpenseCategorySchema =
  createExpenseCategorySchema.partial();

/* ============================================================
                        EXPENSE
============================================================ */

export const createExpenseSchema = z.object({
  category: z
    .string()
    .min(1, "Category is required."),

  title: z
    .string()
    .trim()
    .min(2, "Title is required.")
    .max(200),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  amount: z
    .number()
    .positive("Amount must be greater than zero."),

  expenseDate: z.coerce.date(),

  paymentMethod: z.enum([
    "CASH",
    "UPI",
    "CARD",
    "BANK_TRANSFER",
    "CHEQUE",
  ]),

  vendorName: z
    .string()
    .trim()
    .max(150)
    .optional(),

  receiptNumber: z
    .string()
    .trim()
    .max(100)
    .optional(),

  attachmentUrl: z
    .string()
    .trim()
    .optional(),

  isRecurring: z
    .boolean()
    .optional()
    .default(false),

  recurringType: z
    .enum([
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "YEARLY",
    ])
    .nullable()
    .optional(),

  nextDueDate: z
    .union([
      z.coerce.date(),
      z.null(),
    ])
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const updateExpenseSchema =
  createExpenseSchema.partial();

/* ============================================================
                    APPROVE EXPENSE
============================================================ */

export const approveExpenseSchema =
  z.object({
    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    notes: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  });

/* ============================================================
                    MONTHLY SUMMARY
============================================================ */

export const expenseSummarySchema =
  z.object({
    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  });