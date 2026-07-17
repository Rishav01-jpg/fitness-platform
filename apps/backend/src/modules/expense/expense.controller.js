import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createExpenseCategorySchema,
  updateExpenseCategorySchema,
  createExpenseSchema,
  updateExpenseSchema,
  approveExpenseSchema,
  expenseSummarySchema,
} from "./expense.validation.js";

import {
  createExpenseCategoryService,
  getAllExpenseCategoriesService,
  updateExpenseCategoryService,
  deleteExpenseCategoryService,

  createExpenseService,
  getAllExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  approveExpenseService,
  getExpensesByCategoryService,
  getMonthlyExpenseSummaryService,
} from "./expense.service.js";

/* ============================================================
                    EXPENSE CATEGORY
============================================================ */

// CREATE CATEGORY
const createExpenseCategory = asyncHandler(
  async (req, res) => {
    const validatedData =
      createExpenseCategorySchema.parse(req.body);

    const category =
      await createExpenseCategoryService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      category,
      "Expense category created successfully.",
      201
    );
  }
);

// GET ALL CATEGORIES
const getAllExpenseCategories = asyncHandler(
  async (req, res) => {
    const categories =
      await getAllExpenseCategoriesService(
        req.user
      );

    return successResponse(
      res,
      categories,
      "Expense categories fetched successfully."
    );
  }
);

// UPDATE CATEGORY
const updateExpenseCategory = asyncHandler(
  async (req, res) => {
    const { categoryId } = req.params;

    const validatedData =
      updateExpenseCategorySchema.parse(
        req.body
      );

    const category =
      await updateExpenseCategoryService(
        categoryId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      category,
      "Expense category updated successfully."
    );
  }
);

// DELETE CATEGORY
const deleteExpenseCategory = asyncHandler(
  async (req, res) => {
    const { categoryId } = req.params;

    const category =
      await deleteExpenseCategoryService(
        categoryId,
        req.user
      );

    return successResponse(
      res,
      category,
      "Expense category deleted successfully."
    );
  }
);

/* ============================================================
                        EXPENSE
============================================================ */

// CREATE EXPENSE
const createExpense = asyncHandler(
  async (req, res) => {
    const validatedData =
      createExpenseSchema.parse(req.body);

    const expense =
      await createExpenseService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      expense,
      "Expense created successfully.",
      201
    );
  }
);

// GET ALL EXPENSES
const getAllExpenses = asyncHandler(
  async (req, res) => {
    const expenses =
      await getAllExpensesService(
        req.user
      );

    return successResponse(
      res,
      expenses,
      "Expenses fetched successfully."
    );
  }
);

// GET EXPENSE BY ID
const getExpenseById = asyncHandler(
  async (req, res) => {
    const { expenseId } = req.params;

    const expense =
      await getExpenseByIdService(
        expenseId,
        req.user
      );

    return successResponse(
      res,
      expense,
      "Expense fetched successfully."
    );
  }
);

// UPDATE EXPENSE
const updateExpense = asyncHandler(
  async (req, res) => {
    const { expenseId } = req.params;

    const validatedData =
      updateExpenseSchema.parse(
        req.body
      );

    const expense =
      await updateExpenseService(
        expenseId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      expense,
      "Expense updated successfully."
    );
  }
);

// DELETE EXPENSE
const deleteExpense = asyncHandler(
  async (req, res) => {
    const { expenseId } = req.params;

    const expense =
      await deleteExpenseService(
        expenseId,
        req.user
      );

    return successResponse(
      res,
      expense,
      "Expense deleted successfully."
    );
  }
);

// APPROVE EXPENSE
const approveExpense = asyncHandler(
  async (req, res) => {
    const { expenseId } = req.params;

    approveExpenseSchema.parse(req.body);

    const expense =
      await approveExpenseService(
        expenseId,
        req.user
      );

    return successResponse(
      res,
      expense,
      "Expense approved successfully."
    );
  }
);

// GET EXPENSES BY CATEGORY
const getExpensesByCategory =
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const expenses =
      await getExpensesByCategoryService(
        categoryId,
        req.user
      );

    return successResponse(
      res,
      expenses,
      "Category expenses fetched successfully."
    );
  });

// MONTHLY SUMMARY
const getMonthlyExpenseSummary =
  asyncHandler(async (req, res) => {
    const validatedData =
      expenseSummarySchema.parse(req.query);

    const summary =
      await getMonthlyExpenseSummaryService(
        validatedData.startDate,
        validatedData.endDate,
        req.user
      );

    return successResponse(
      res,
      summary,
      "Expense summary fetched successfully."
    );
  });

export {
  // Category
  createExpenseCategory,
  getAllExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,

  // Expense
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
  getExpensesByCategory,
  getMonthlyExpenseSummary,
};