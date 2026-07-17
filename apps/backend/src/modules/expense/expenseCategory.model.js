import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    color: {
      type: String,
      default: "#4CAF50",
    },

    icon: {
      type: String,
      default: "category",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

expenseCategorySchema.index(
  {
    tenant: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);

export default ExpenseCategory;