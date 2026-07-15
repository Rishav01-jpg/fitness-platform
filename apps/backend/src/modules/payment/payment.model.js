import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "CASH",
        "UPI",
        "CARD",
        "BANK_TRANSFER",
      ],
      required: true,
    },

   paymentStatus: {
  type: String,
  enum: [
    "PENDING",
    "PAID",
    "PARTIAL",
    "FAILED",
  ],
  required: true,
},

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    paidDate: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    paidAmount: {
  type: Number,
  default: 0,
  min: 0,
},

balanceAmount: {
  type: Number,
  default: 0,
  min: 0,
},

    status: {
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

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;