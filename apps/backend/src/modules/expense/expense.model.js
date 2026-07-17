import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategory",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "CASH",
        "UPI",
        "CARD",
        "BANK_TRANSFER",
        "CHEQUE",
      ],
      required: true,
    },

    vendorName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    receiptNumber: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    attachmentUrl: {
      type: String,
      default: "",
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringType: {
      type: String,
      enum: [
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "YEARLY",
      ],
      default: null,
    },

    nextDueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "PAID",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    recordStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
      ],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({
  tenant: 1,
  expenseDate: -1,
});

expenseSchema.index({
  tenant: 1,
  status: 1,
});

expenseSchema.index({
  tenant: 1,
  category: 1,
});

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

export default Expense;