import { z } from "zod";

/* ============================================================
                    COMMON DATE RANGE
============================================================ */

const dateRangeSchema = z.object({
  startDate: z.coerce.date({
    required_error: "Start date is required.",
  }),

  endDate: z.coerce.date({
    required_error: "End date is required.",
  }),
});

/* ============================================================
                    DASHBOARD REPORT
============================================================ */

export const dashboardReportSchema =
  z.object({});

/* ============================================================
                    REVENUE REPORT
============================================================ */

export const revenueReportSchema =
  dateRangeSchema;

/* ============================================================
                    EXPENSE REPORT
============================================================ */

export const expenseReportSchema =
  dateRangeSchema;

/* ============================================================
                    PROFIT REPORT
============================================================ */

export const profitReportSchema =
  dateRangeSchema;

/* ============================================================
                    MEMBERSHIP REPORT
============================================================ */

export const membershipReportSchema =
  z.object({});

/* ============================================================
                    ATTENDANCE REPORT
============================================================ */

export const attendanceReportSchema =
  dateRangeSchema;

/* ============================================================
                    TRAINER REPORT
============================================================ */

export const trainerReportSchema =
  z.object({});

/* ============================================================
                    PROGRESS REPORT
============================================================ */

export const progressReportSchema =
  dateRangeSchema;