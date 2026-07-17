import express from "express";

import {
  createExpenseCategory,
  getAllExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,

  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
  getExpensesByCategory,
  getMonthlyExpenseSummary,
} from "./expense.controller.js";

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
                EXPENSE CATEGORY ROUTES
============================================================ */

// Create Category
router.post(
  "/categories",
  hasPermission(
    PERMISSIONS.CREATE_EXPENSE_CATEGORY
  ),
  createExpenseCategory
);

// Get All Categories
router.get(
  "/categories",
  hasPermission(
    PERMISSIONS.VIEW_EXPENSE_CATEGORY
  ),
  getAllExpenseCategories
);

// Update Category
router.put(
  "/categories/:categoryId",
  hasPermission(
    PERMISSIONS.UPDATE_EXPENSE_CATEGORY
  ),
  updateExpenseCategory
);

// Delete Category
router.delete(
  "/categories/:categoryId",
  hasPermission(
    PERMISSIONS.DELETE_EXPENSE_CATEGORY
  ),
  deleteExpenseCategory
);

/* ============================================================
                    EXPENSE ROUTES
============================================================ */

// Create Expense
router.post(
  "/",
  hasPermission(
    PERMISSIONS.CREATE_EXPENSE
  ),
  createExpense
);

// Get All Expenses
router.get(
  "/",
  hasPermission(
    PERMISSIONS.VIEW_EXPENSE
  ),
  getAllExpenses
);

// Expense Summary
router.get(
  "/summary",
  hasPermission(
    PERMISSIONS.VIEW_EXPENSE
  ),
  getMonthlyExpenseSummary
);

// Expenses By Category
router.get(
  "/category/:categoryId",
  hasPermission(
    PERMISSIONS.VIEW_EXPENSE
  ),
  getExpensesByCategory
);

// Get Expense By Id
router.get(
  "/:expenseId",
  hasPermission(
    PERMISSIONS.VIEW_EXPENSE
  ),
  getExpenseById
);

// Update Expense
router.put(
  "/:expenseId",
  hasPermission(
    PERMISSIONS.UPDATE_EXPENSE
  ),
  updateExpense
);

// Approve Expense
router.patch(
  "/:expenseId/approve",
  hasPermission(
    PERMISSIONS.APPROVE_EXPENSE
  ),
  approveExpense
);

// Delete Expense
router.delete(
  "/:expenseId",
  hasPermission(
    PERMISSIONS.DELETE_EXPENSE
  ),
  deleteExpense
);

export default router;