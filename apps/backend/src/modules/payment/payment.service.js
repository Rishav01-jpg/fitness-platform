import AppError from "../../shared/errors/AppError.js";
import { ROLES } from "../../constants/roles.js";

import Client from "../client/client.model.js";
import Membership from "../membership/membership.model.js";

import {
  createPayment,
  findPaymentById,
  findAllPayments,
  findPaymentsByTenant,
  updatePayment,
  softDeletePayment,
} from "./payment.repository.js";

const createPaymentService = async (
  paymentData,
  user
) => {
  // Only Admin can create payments
  if (user.role !== ROLES.ADMIN) {
    throw new AppError(
      "Only Admin can create payments.",
      403
    );
  }

  // Client validation
  const client = await Client.findById(
    paymentData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Membership validation
  const membership = await Membership.findById(
    paymentData.membership
  );

  if (!membership) {
    throw new AppError("Membership not found.", 404);
  }

  // Membership must be active
  if (membership.status !== "ACTIVE") {
    throw new AppError(
      "Membership is not active.",
      400
    );
  }

  // Tenant validation
  if (
    client.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  if (
    membership.tenant.toString() !== user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Discount validation
  if (paymentData.discount > paymentData.amount) {
    throw new AppError(
      "Discount cannot be greater than amount.",
      400
    );
  }

  // Calculate final amount
  const subtotal =
  paymentData.amount -
  (paymentData.discount || 0);

const taxAmount =
  subtotal *
  ((paymentData.tax || 0) / 100);

const finalAmount = Number(
  (subtotal + taxAmount).toFixed(2)
);

const paidAmount =
  paymentData.paidAmount || 0;

if (paidAmount > finalAmount) {
  throw new AppError(
    "Paid amount cannot be greater than final amount.",
    400
  );
}

const balanceAmount = Number(
  (finalAmount - paidAmount).toFixed(2)
);

let paymentStatus;

if (paidAmount === 0) {
  paymentStatus = "PENDING";
} else if (paidAmount < finalAmount) {
  paymentStatus = "PARTIAL";
} else {
  paymentStatus = "PAID";
}

  return await createPayment({
  ...paymentData,
  finalAmount,
  paidAmount,
  balanceAmount,
  paymentStatus,
  tenant: user.tenantId,
  collectedBy: user._id,
});
};
//get all payments
const getAllPaymentsService = async (user) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllPayments();
  }

  return await findPaymentsByTenant(user.tenantId);
};

//get payment by id
const getPaymentByIdService = async (
  paymentId,
  user
) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    payment.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  return payment;
};

//update payments
const updatePaymentService = async (
  paymentId,
  updateData,
  user
) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    payment.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }
// Lock financial fields after payment has been received
if (
  payment.paidAmount > 0 &&
  (
    updateData.amount !== undefined ||
    updateData.discount !== undefined ||
    updateData.tax !== undefined
  )
) {
  throw new AppError(
    "Financial details cannot be modified after payment has been received. Create a refund or a new invoice instead.",
    400
  );
}
  const amount =
    updateData.amount ?? payment.amount;

  const discount =
    updateData.discount ?? payment.discount;

  const tax =
    updateData.tax ?? payment.tax;

  const subtotal =
    amount - discount;

  const taxAmount =
    subtotal * (tax / 100);

  const finalAmount = Number(
    (subtotal + taxAmount).toFixed(2)
  );

  const paidAmount =
    updateData.paidAmount ??
    payment.paidAmount;

  if (paidAmount > finalAmount) {
    throw new AppError(
      "Paid amount cannot be greater than final amount.",
      400
    );
  }

  const balanceAmount = Number(
    (finalAmount - paidAmount).toFixed(2)
  );

  let paymentStatus;

  if (paidAmount === 0) {
    paymentStatus = "PENDING";
  } else if (paidAmount < finalAmount) {
    paymentStatus = "PARTIAL";
  } else {
    paymentStatus = "PAID";
  }

  return await updatePayment(
    paymentId,
    {
      ...updateData,
      finalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus,
    }
  );
};

//soft delete payment
const deletePaymentService = async (
  paymentId,
  user
) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    payment.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  // Financial protection
  if (
    payment.paymentStatus === "PAID" ||
    payment.paymentStatus === "PARTIAL"
  ) {
    throw new AppError(
      "Paid or partially paid transactions cannot be deleted.",
      400
    );
  }

  return await softDeletePayment(paymentId);
};

export {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
};