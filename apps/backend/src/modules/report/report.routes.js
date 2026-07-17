import express from "express";

import {
  getDashboardReport,
  getRevenueReport,
  getExpenseReport,
  getProfitReport,
  getMembershipReport,
  getAttendanceReport,
  getTrainerReport,
  getProgressReport,
} from "./report.controller.js";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

const router = express.Router();

/* ============================================================
                    COMMON MIDDLEWARE
============================================================ */

router.use(authenticate);

router.use(
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  )
);

router.use(checkTenantStatus);

router.use(checkSubscription);

/* ============================================================
                    DASHBOARD REPORT
============================================================ */

router.get(
  "/dashboard",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getDashboardReport
);

/* ============================================================
                    REVENUE REPORT
============================================================ */

router.get(
  "/revenue",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getRevenueReport
);

/* ============================================================
                    EXPENSE REPORT
============================================================ */

router.get(
  "/expenses",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getExpenseReport
);

/* ============================================================
                    PROFIT & LOSS
============================================================ */

router.get(
  "/profit-loss",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getProfitReport
);

/* ============================================================
                    MEMBERSHIP REPORT
============================================================ */

router.get(
  "/memberships",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getMembershipReport
);

/* ============================================================
                    ATTENDANCE REPORT
============================================================ */

router.get(
  "/attendance",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getAttendanceReport
);

/* ============================================================
                    TRAINER REPORT
============================================================ */

router.get(
  "/trainers",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getTrainerReport
);

/* ============================================================
                    PROGRESS REPORT
============================================================ */

router.get(
  "/progress",
  hasPermission(
    PERMISSIONS.VIEW_REPORT
  ),
  getProgressReport
);

export default router;