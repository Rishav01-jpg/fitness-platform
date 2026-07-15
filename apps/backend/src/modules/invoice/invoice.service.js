import AppError from "../../shared/errors/AppError.js";
import { ROLES } from "../../constants/roles.js";

import Client from "../client/client.model.js";
import Membership from "../membership/membership.model.js";

import {
  createInvoice,
  findInvoiceById,
  findAllInvoices,
  findInvoicesByTenant,
  updateInvoice,
  softDeleteInvoice,
} from "./invoice.repository.js";

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();

  let sequence = 1;

  while (true) {
    const invoiceNumber = `INV-${year}-${String(
      sequence
    ).padStart(6, "0")}`;

    const exists =
      await findInvoiceByNumber(invoiceNumber);

    if (!exists) {
      return invoiceNumber;
    }

    sequence++;
  }
};
const createInvoiceService = async (
  invoiceData,
  user
) => {
  if (user.role !== ROLES.ADMIN) {
    throw new AppError(
      "Only Admin can create invoices.",
      403
    );
  }

  const client = await Client.findById(
    invoiceData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  const membership = await Membership.findById(
    invoiceData.membership
  );

  if (!membership) {
    throw new AppError("Membership not found.", 404);
  }

  if (membership.status !== "ACTIVE") {
    throw new AppError(
      "Membership is not active.",
      400
    );
  }

  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  if (
    membership.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  if (
    (invoiceData.discount || 0) >
    invoiceData.amount
  ) {
    throw new AppError(
      "Discount cannot exceed amount.",
      400
    );
  }

  const subtotal =
    invoiceData.amount -
    (invoiceData.discount || 0);

  const taxAmount =
    subtotal *
    ((invoiceData.tax || 0) / 100);

  const totalAmount = Number(
    (subtotal + taxAmount).toFixed(2)
  );

  const invoiceNumber =
    await generateInvoiceNumber();

  return await createInvoice({
    ...invoiceData,
    invoiceNumber,
    totalAmount,
    paidAmount: 0,
    balanceAmount: totalAmount,
    invoiceStatus: "ISSUED",
    tenant: user.tenantId,
  });
};

//get all invoices
const getAllInvoicesService = async (user) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllInvoices();
  }

  return await findInvoicesByTenant(user.tenantId);
};

//get invoices by id
const getInvoiceByIdService = async (
  invoiceId,
  user
) => {
  const invoice = await findInvoiceById(invoiceId);

  if (!invoice) {
    throw new AppError(
      "Invoice not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    invoice.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  return invoice;
};

//update invoice
const updateInvoiceService = async (
  invoiceId,
  updateData,
  user
) => {
  const invoice = await findInvoiceById(invoiceId);

  if (!invoice) {
    throw new AppError(
      "Invoice not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    invoice.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  // Lock financial fields after payment
  if (
    invoice.paidAmount > 0 &&
    (
      updateData.amount !== undefined ||
      updateData.discount !== undefined ||
      updateData.tax !== undefined
    )
  ) {
    throw new AppError(
      "Financial details cannot be modified after payment has been received.",
      400
    );
  }

  const amount =
    updateData.amount ?? invoice.amount;

  const discount =
    updateData.discount ?? invoice.discount;

  const tax =
    updateData.tax ?? invoice.tax;

  if (discount > amount) {
    throw new AppError(
      "Discount cannot exceed amount.",
      400
    );
  }

  const subtotal = amount - discount;

  const taxAmount =
    subtotal * (tax / 100);

  const totalAmount = Number(
    (subtotal + taxAmount).toFixed(2)
  );

  const paidAmount = invoice.paidAmount;

  const balanceAmount = Number(
    (totalAmount - paidAmount).toFixed(2)
  );

  let invoiceStatus = invoice.invoiceStatus;

  if (paidAmount === 0) {
    invoiceStatus = "ISSUED";
  } else if (paidAmount < totalAmount) {
    invoiceStatus = "PARTIAL";
  } else {
    invoiceStatus = "PAID";
  }

  return await updateInvoice(
    invoiceId,
    {
      ...updateData,
      totalAmount,
      balanceAmount,
      invoiceStatus,
    }
  );
};

//soft delete invoice
const deleteInvoiceService = async (
  invoiceId,
  user
) => {
  const invoice = await findInvoiceById(invoiceId);

  if (!invoice) {
    throw new AppError(
      "Invoice not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    invoice.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError(
      "Access denied.",
      403
    );
  }

  // Financial protection
  if (
    invoice.invoiceStatus === "PAID" ||
    invoice.invoiceStatus === "PARTIAL" ||
    invoice.invoiceStatus === "CANCELLED"
  ) {
    throw new AppError(
      "Paid, partially paid, or cancelled invoices cannot be deleted.",
      400
    );
  }

  return await softDeleteInvoice(invoiceId);
};

export {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
};