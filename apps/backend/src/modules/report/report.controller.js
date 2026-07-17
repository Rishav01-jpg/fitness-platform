import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  dashboardReportSchema,
  revenueReportSchema,
  expenseReportSchema,
  profitReportSchema,
  membershipReportSchema,
  attendanceReportSchema,
  trainerReportSchema,
  progressReportSchema,
} from "./report.validation.js";

import {
  getDashboardReportService,
  getRevenueReportService,
  getExpenseReportService,
  getProfitReportService,
  getMembershipReportService,
  getAttendanceReportService,
  getTrainerReportService,
  getProgressReportService,
} from "./report.service.js";

/* ============================================================
                    DASHBOARD REPORT
============================================================ */

const getDashboardReport = asyncHandler(
  async (req, res) => {
    dashboardReportSchema.parse(req.query);

    const report =
      await getDashboardReportService(
        req.user
      );

    return successResponse(
      res,
      report,
      "Dashboard report fetched successfully."
    );
  }
);

/* ============================================================
                    REVENUE REPORT
============================================================ */

const getRevenueReport = asyncHandler(
  async (req, res) => {
    const validatedData =
      revenueReportSchema.parse(
        req.query
      );

    const report =
      await getRevenueReportService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      report,
      "Revenue report fetched successfully."
    );
  }
);

/* ============================================================
                    EXPENSE REPORT
============================================================ */

const getExpenseReport = asyncHandler(
  async (req, res) => {
    const validatedData =
      expenseReportSchema.parse(
        req.query
      );

    const report =
      await getExpenseReportService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      report,
      "Expense report fetched successfully."
    );
  }
);

/* ============================================================
                    PROFIT REPORT
============================================================ */

const getProfitReport = asyncHandler(
  async (req, res) => {
    const validatedData =
      profitReportSchema.parse(
        req.query
      );

    const report =
      await getProfitReportService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      report,
      "Profit & Loss report fetched successfully."
    );
  }
);

/* ============================================================
                    MEMBERSHIP REPORT
============================================================ */

const getMembershipReport =
  asyncHandler(async (req, res) => {
    membershipReportSchema.parse(
      req.query
    );

    const report =
      await getMembershipReportService(
        req.user
      );

    return successResponse(
      res,
      report,
      "Membership report fetched successfully."
    );
  });

/* ============================================================
                    ATTENDANCE REPORT
============================================================ */

const getAttendanceReport =
  asyncHandler(async (req, res) => {
    const validatedData =
      attendanceReportSchema.parse(
        req.query
      );

    const report =
      await getAttendanceReportService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      report,
      "Attendance report fetched successfully."
    );
  });

/* ============================================================
                    TRAINER REPORT
============================================================ */

const getTrainerReport =
  asyncHandler(async (req, res) => {
    trainerReportSchema.parse(
      req.query
    );

    const report =
      await getTrainerReportService(
        req.user
      );

    return successResponse(
      res,
      report,
      "Trainer report fetched successfully."
    );
  });

/* ============================================================
                    PROGRESS REPORT
============================================================ */

const getProgressReport =
  asyncHandler(async (req, res) => {
    const validatedData =
      progressReportSchema.parse(
        req.query
      );

    const report =
      await getProgressReportService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      report,
      "Progress report fetched successfully."
    );
  });

export {
  getDashboardReport,
  getRevenueReport,
  getExpenseReport,
  getProfitReport,
  getMembershipReport,
  getAttendanceReport,
  getTrainerReport,
  getProgressReport,
};