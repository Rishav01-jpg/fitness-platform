import ExpenseCategory from "./expenseCategory.model.js";
import Expense from "./expense.model.js";

/* ==========================
   EXPENSE CATEGORY
========================== */

// Create
const createExpenseCategory = async (data) => {
  return await ExpenseCategory.create(data);
};

// Get All
const findAllExpenseCategories = async (tenantId) => {
  return await ExpenseCategory.find({
    tenant: tenantId,
    status: "ACTIVE",
  }).sort({ name: 1 });
};

// Get By ID
const findExpenseCategoryById = async (categoryId) => {
  return await ExpenseCategory.findById(categoryId);
};

// Get By Name
const findExpenseCategoryByName = async (
  tenantId,
  name
) => {
  return await ExpenseCategory.findOne({
    tenant: tenantId,
    name,
    status: "ACTIVE",
  });
};

// Update
const updateExpenseCategory = async (
  categoryId,
  updateData
) => {
  return await ExpenseCategory.findByIdAndUpdate(
    categoryId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete
const softDeleteExpenseCategory = async (
  categoryId
) => {
  return await ExpenseCategory.findByIdAndUpdate(
    categoryId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
    }
  );
};

/* ==========================
   EXPENSE
========================== */

// Create
const createExpense = async (data) => {
  return await Expense.create(data);
};

// Get All
const findAllExpenses = async (tenantId) => {
  return await Expense.find({
    tenant: tenantId,
    recordStatus: "ACTIVE",
  })
    .populate("category")
    .populate("createdBy")
    .populate("approvedBy")
    .sort({ expenseDate: -1 });
};

// Get By ID
const findExpenseById = async (expenseId) => {
  return await Expense.findById(expenseId)
    .populate("category")
    .populate("createdBy")
    .populate("approvedBy");
};

// Update
const updateExpense = async (
  expenseId,
  updateData
) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category")
    .populate("createdBy")
    .populate("approvedBy");
};

// Soft Delete
const softDeleteExpense = async (
  expenseId
) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    {
      recordStatus: "INACTIVE",
    },
    {
      new: true,
    }
  );
};

// Get By Category
const findExpensesByCategory = async (
  tenantId,
  categoryId
) => {
  return await Expense.find({
    tenant: tenantId,
    category: categoryId,
    recordStatus: "ACTIVE",
  })
    .populate("category")
    .sort({ expenseDate: -1 });
};

// Monthly Expense
const findMonthlyExpenses = async (
  tenantId,
  startDate,
  endDate
) => {
  return await Expense.find({
    tenant: tenantId,
    recordStatus: "ACTIVE",
    expenseDate: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("category");
};

// Total Expense
const getTotalExpense = async (
  tenantId,
  startDate,
  endDate
) => {
  const result = await Expense.aggregate([
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
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result.length
    ? result[0].total
    : 0;
};

export {
  // Category
  createExpenseCategory,
  findAllExpenseCategories,
  findExpenseCategoryById,
  findExpenseCategoryByName,
  updateExpenseCategory,
  softDeleteExpenseCategory,

  // Expense
  createExpense,
  findAllExpenses,
  findExpenseById,
  updateExpense,
  softDeleteExpense,
  findExpensesByCategory,
  findMonthlyExpenses,
  getTotalExpense,
};