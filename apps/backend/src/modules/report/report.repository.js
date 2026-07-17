import Client from "../client/client.model.js";
import Membership from "../membership/membership.model.js";
import Attendance from "../attendance/attendance.model.js";
import Trainer from "../trainer/trainer.model.js";
import Progress from "../progress/progress.model.js";
import Payment from "../payment/payment.model.js";
import Expense from "../expense/expense.model.js";

/* ============================================================
                    DASHBOARD REPORT
============================================================ */

const getDashboardReport = async (tenantId) => {
  const [
    totalClients,
    activeMemberships,
    totalTrainers,
  ] = await Promise.all([
    Client.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
    }),

    Membership.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
    }),

    Trainer.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
    }),
  ]);

  return {
    totalClients,
    activeMemberships,
    totalTrainers,
  };
};

/* ============================================================
                    REVENUE REPORT
============================================================ */

const getRevenueReport = async (
  tenantId,
  startDate,
  endDate
) => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        tenant: tenantId,
        paymentStatus: "PAID",
        paidDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$paidAmount",
        },
        totalPayments: {
          $sum: 1,
        },
      },
    },
  ]);

  return revenue[0] || {
    totalRevenue: 0,
    totalPayments: 0,
  };
};

/* ============================================================
                    EXPENSE REPORT
============================================================ */

const getExpenseReport = async (
  tenantId,
  startDate,
  endDate
) => {
  const expenses = await Expense.aggregate([
    {
      $match: {
        tenant: tenantId,
        recordStatus: "ACTIVE",
        expenseDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: {
          $sum: "$amount",
        },
        totalTransactions: {
          $sum: 1,
        },
      },
    },
  ]);

  return expenses[0] || {
    totalExpense: 0,
    totalTransactions: 0,
  };
};

/* ============================================================
                    PROFIT REPORT
============================================================ */

const getProfitReport = async (
  tenantId,
  startDate,
  endDate
) => {
  const revenue =
    await getRevenueReport(
      tenantId,
      startDate,
      endDate
    );

  const expense =
    await getExpenseReport(
      tenantId,
      startDate,
      endDate
    );

  return {
    revenue: revenue.totalRevenue,
    expense: expense.totalExpense,
    profit:
      revenue.totalRevenue -
      expense.totalExpense,
  };
};

/* ============================================================
                    MEMBERSHIP REPORT
============================================================ */

const getMembershipReport = async (
  tenantId
) => {
  const [
    active,
    inactive,
  ] = await Promise.all([
    Membership.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
    }),

    Membership.countDocuments({
      tenant: tenantId,
      status: "INACTIVE",
    }),
  ]);

  return {
    active,
    inactive,
  };
};

/* ============================================================
                    ATTENDANCE REPORT
============================================================ */

const getAttendanceReport = async (
  tenantId,
  startDate,
  endDate
) => {
  const attendance =
    await Attendance.countDocuments({
      tenant: tenantId,
      attendanceDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

  return {
    totalAttendance: attendance,
  };
};

/* ============================================================
                    TRAINER REPORT
============================================================ */

const getTrainerReport = async (
  tenantId
) => {
  const totalTrainers =
    await Trainer.countDocuments({
      tenant: tenantId,
      status: "ACTIVE",
    });

  return {
    totalTrainers,
  };
};

/* ============================================================
                    PROGRESS REPORT
============================================================ */

const getProgressReport = async (
  tenantId,
  startDate,
  endDate
) => {
  const totalProgress =
    await Progress.countDocuments({
      tenant: tenantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

  return {
    totalProgress,
  };
};

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