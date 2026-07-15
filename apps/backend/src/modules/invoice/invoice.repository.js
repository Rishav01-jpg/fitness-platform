import Invoice from "./invoice.model.js";

// Create Invoice
const createInvoice = async (invoiceData) => {
  return await Invoice.create(invoiceData);
};

// Find Invoice By ID
const findInvoiceById = async (invoiceId) => {
  return await Invoice.findById(invoiceId)
    .populate("client")
    .populate("membership");
};

// Find Invoice By Number
const findInvoiceByNumber = async (invoiceNumber) => {
  return await Invoice.findOne({ invoiceNumber });
};

// Get All Invoices
const findAllInvoices = async () => {
  return await Invoice.find()
    .populate("client")
    .populate("membership");
};

// Get Invoices By Tenant
const findInvoicesByTenant = async (tenantId) => {
  return await Invoice.find({
    tenant: tenantId,
    status: "ACTIVE",
  })
    .populate("client")
    .populate("membership");
};

// Get Invoices By Client
const findInvoicesByClient = async (clientId) => {
  return await Invoice.find({
    client: clientId,
    status: "ACTIVE",
  })
    .sort({ createdAt: -1 })
    .populate("membership");
};

// Update Invoice
const updateInvoice = async (
  invoiceId,
  updateData
) => {
  return await Invoice.findByIdAndUpdate(
    invoiceId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Invoice
const softDeleteInvoice = async (
  invoiceId
) => {
  return await Invoice.findByIdAndUpdate(
    invoiceId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createInvoice,
  findInvoiceById,
  findInvoiceByNumber,
  findAllInvoices,
  findInvoicesByTenant,
  findInvoicesByClient,
  updateInvoice,
  softDeleteInvoice,
};