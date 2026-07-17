import AppError from "../../shared/errors/AppError.js";

import { ROLES } from "../../constants/roles.js";

import {
  createExpenseCategory,
  findAllExpenseCategories,
  findExpenseCategoryById,
  findExpenseCategoryByName,
  updateExpenseCategory,
  softDeleteExpenseCategory,

  createExpense,
  findAllExpenses,
  findExpenseById,
  updateExpense,
  softDeleteExpense,
  findExpensesByCategory,
  findMonthlyExpenses,
  getTotalExpense,
} from "./expense.repository.js";

/* ============================================================
                    HELPER FUNCTIONS
============================================================ */

const validateTenant = (
  resourceTenant,
  userTenant,
  role
) => {
  if (
    role !== ROLES.SUPER_ADMIN &&
    resourceTenant.toString() !==
      userTenant.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }
};

const validatePositiveAmount = (
  amount
) => {
  if (amount <= 0) {
    throw new AppError(
      "Expense amount must be greater than zero.",
      400
    );
  }
};

const validateRecurringExpense = (
  expenseData
) => {
  if (
    expenseData.isRecurring &&
    !expenseData.recurringType
  ) {
    throw new AppError(
      "Recurring type is required.",
      400
    );
  }

  if (
    expenseData.isRecurring &&
    !expenseData.nextDueDate
  ) {
    throw new AppError(
      "Next due date is required.",
      400
    );
  }
};

/* ============================================================
                EXPENSE CATEGORY SERVICES
============================================================ */

/*
CREATE CATEGORY
*/

const createExpenseCategoryService =
  async (
    categoryData,
    user
  ) => {
    const exists =
      await findExpenseCategoryByName(
        user.tenantId,
        categoryData.name
      );

    if (exists) {
      throw new AppError(
        "Expense category already exists.",
        400
      );
    }

    return await createExpenseCategory({
      ...categoryData,
      tenant: user.tenantId,
    });
  };

/*
GET ALL CATEGORIES
*/

const getAllExpenseCategoriesService =
  async (user) => {
    return await findAllExpenseCategories(
      user.tenantId
    );
  };

/*
UPDATE CATEGORY
*/

const updateExpenseCategoryService =
  async (
    categoryId,
    updateData,
    user
  ) => {
    const category =
      await findExpenseCategoryById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        "Expense category not found.",
        404
      );
    }

    validateTenant(
      category.tenant,
      user.tenantId,
      user.role
    );

    if (
      updateData.name &&
      updateData.name !==
        category.name
    ) {
      const exists =
        await findExpenseCategoryByName(
          user.tenantId,
          updateData.name
        );

      if (exists) {
        throw new AppError(
          "Expense category already exists.",
          400
        );
      }
    }

    return await updateExpenseCategory(
      categoryId,
      updateData
    );
  };

/*
DELETE CATEGORY
*/

const deleteExpenseCategoryService =
  async (
    categoryId,
    user
  ) => {
    const category =
      await findExpenseCategoryById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        "Expense category not found.",
        404
      );
    }

    validateTenant(
      category.tenant,
      user.tenantId,
      user.role
    );

    return await softDeleteExpenseCategory(
      categoryId
    );
  };

/* ============================================================
                    EXPENSE SERVICES
============================================================ */

/*
CREATE EXPENSE
*/

const createExpenseService =
  async (
    expenseData,
    user
  ) => {
    validatePositiveAmount(
      expenseData.amount
    );

    validateRecurringExpense(
      expenseData
    );

    const category =
      await findExpenseCategoryById(
        expenseData.category
      );

    if (!category) {
      throw new AppError(
        "Expense category not found.",
        404
      );
    }

    validateTenant(
      category.tenant,
      user.tenantId,
      user.role
    );

    return await createExpense({
      ...expenseData,

      tenant: user.tenantId,

     createdBy: user._id,

      status: "PENDING",
    });
  };
  /*
GET ALL EXPENSES
*/

const getAllExpensesService = async (user) => {
  return await findAllExpenses(user.tenantId);
};

/*
GET EXPENSE BY ID
*/

const getExpenseByIdService = async (
  expenseId,
  user
) => {
  const expense = await findExpenseById(
    expenseId
  );

  if (!expense) {
    throw new AppError(
      "Expense not found.",
      404
    );
  }

  validateTenant(
    expense.tenant,
    user.tenantId,
    user.role
  );

  return expense;
};

/*
UPDATE EXPENSE
*/

const updateExpenseService = async (
  expenseId,
  updateData,
  user
) => {
  const expense = await findExpenseById(
    expenseId
  );

  if (!expense) {
    throw new AppError(
      "Expense not found.",
      404
    );
  }

  validateTenant(
    expense.tenant,
    user.tenantId,
    user.role
  );

  // Don't allow editing approved or paid expenses
  if (
    expense.status === "APPROVED" ||
    expense.status === "PAID"
  ) {
    throw new AppError(
      "Approved or paid expenses cannot be modified.",
      400
    );
  }

  if (updateData.amount !== undefined) {
    validatePositiveAmount(
      updateData.amount
    );
  }

  if (updateData.category) {
    const category =
      await findExpenseCategoryById(
        updateData.category
      );

    if (!category) {
      throw new AppError(
        "Expense category not found.",
        404
      );
    }

    validateTenant(
      category.tenant,
      user.tenantId,
      user.role
    );
  }

  validateRecurringExpense({
    ...expense.toObject(),
    ...updateData,
  });

  return await updateExpense(
    expenseId,
    updateData
  );
};

/*
DELETE EXPENSE
*/

const deleteExpenseService = async (
  expenseId,
  user
) => {
  const expense = await findExpenseById(
    expenseId
  );

  if (!expense) {
    throw new AppError(
      "Expense not found.",
      404
    );
  }

  validateTenant(
    expense.tenant,
    user.tenantId,
    user.role
  );

  if (expense.status === "PAID") {
    throw new AppError(
      "Paid expenses cannot be deleted.",
      400
    );
  }

  return await softDeleteExpense(
    expenseId
  );
};

/*
APPROVE EXPENSE
*/

const approveExpenseService = async (
  expenseId,
  user
) => {
  const expense = await findExpenseById(
    expenseId
  );

  if (!expense) {
    throw new AppError(
      "Expense not found.",
      404
    );
  }

  validateTenant(
    expense.tenant,
    user.tenantId,
    user.role
  );

  if (
    expense.status !== "PENDING"
  ) {
    throw new AppError(
      "Only pending expenses can be approved.",
      400
    );
  }

  return await updateExpense(
    expenseId,
    {
      status: "APPROVED",
      approvedBy: user._id,
      approvedAt: new Date(),
    }
  );
};

/*
CATEGORY WISE EXPENSES
*/

const getExpensesByCategoryService =
  async (
    categoryId,
    user
  ) => {
    const category =
      await findExpenseCategoryById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        "Expense category not found.",
        404
      );
    }

    validateTenant(
      category.tenant,
      user.tenantId,
      user.role
    );

    return await findExpensesByCategory(
      user.tenantId,
      categoryId
    );
  };

/*
MONTHLY SUMMARY
*/

const getMonthlyExpenseSummaryService =
  async (
    startDate,
    endDate,
    user
  ) => {
    const expenses =
      await findMonthlyExpenses(
        user.tenantId,
        startDate,
        endDate
      );

    const total =
      await getTotalExpense(
        user.tenantId,
        startDate,
        endDate
      );

    return {
      totalExpense: total,
      totalTransactions:
        expenses.length,
      expenses,
    };
  };

/* ============================================================
                        EXPORTS
============================================================ */

export {
  // Category
  createExpenseCategoryService,
  getAllExpenseCategoriesService,
  updateExpenseCategoryService,
  deleteExpenseCategoryService,

  // Expense
  createExpenseService,
  getAllExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  approveExpenseService,
  getExpensesByCategoryService,
  getMonthlyExpenseSummaryService,
};