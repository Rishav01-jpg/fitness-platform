import AppError from "../../shared/errors/AppError.js";

import {
  getDashboardReport,
  getRevenueReport,
  getExpenseReport,
  getProfitReport,
  getMembershipReport,
  getAttendanceReport,
  getTrainerReport,
  getProgressReport,
} from "./report.repository.js";

/* ============================================================
                    HELPERS
============================================================ */

const validateDateRange = (
  startDate,
  endDate
) => {
  if (
    startDate &&
    endDate &&
    startDate > endDate
  ) {
    throw new AppError(
      "Start date cannot be greater than end date.",
      400
    );
  }
};

/* ============================================================
                    DASHBOARD REPORT
============================================================ */

const getDashboardReportService =
  async (user) => {
    return await getDashboardReport(
      user.tenantId
    );
  };

/* ============================================================
                    REVENUE REPORT
============================================================ */

const getRevenueReportService =
  async (
    startDate,
    endDate,
    user
  ) => {
    validateDateRange(
      startDate,
      endDate
    );

    return await getRevenueReport(
      user.tenantId,
      startDate,
      endDate
    );
  };

/* ============================================================
                    EXPENSE REPORT
============================================================ */

const getExpenseReportService =
  async (
    startDate,
    endDate,
    user
  ) => {
    validateDateRange(
      startDate,
      endDate
    );

    return await getExpenseReport(
      user.tenantId,
      startDate,
      endDate
    );
  };

/* ============================================================
                    PROFIT REPORT
============================================================ */

const getProfitReportService =
  async (
    startDate,
    endDate,
    user
  ) => {
    validateDateRange(
      startDate,
      endDate
    );

    return await getProfitReport(
      user.tenantId,
      startDate,
      endDate
    );
  };

/* ============================================================
                    MEMBERSHIP REPORT
============================================================ */

const getMembershipReportService =
  async (user) => {
    return await getMembershipReport(
      user.tenantId
    );
  };

/* ============================================================
                    ATTENDANCE REPORT
============================================================ */

const getAttendanceReportService =
  async (
    startDate,
    endDate,
    user
  ) => {
    validateDateRange(
      startDate,
      endDate
    );

    return await getAttendanceReport(
      user.tenantId,
      startDate,
      endDate
    );
  };

/* ============================================================
                    TRAINER REPORT
============================================================ */

const getTrainerReportService =
  async (user) => {
    return await getTrainerReport(
      user.tenantId
    );
  };

/* ============================================================
                    PROGRESS REPORT
============================================================ */

const getProgressReportService =
  async (
    startDate,
    endDate,
    user
  ) => {
    validateDateRange(
      startDate,
      endDate
    );

    return await getProgressReport(
      user.tenantId,
      startDate,
      endDate
    );
  };

/* ============================================================
                        EXPORTS
============================================================ */

export {
  getDashboardReportService,
  getRevenueReportService,
  getExpenseReportService,
  getProfitReportService,
  getMembershipReportService,
  getAttendanceReportService,
  getTrainerReportService,
  getProgressReportService,
};