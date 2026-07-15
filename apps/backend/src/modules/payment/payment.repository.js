import Payment from "./payment.model.js";

// Create Payment
const createPayment = async (paymentData) => {
  return await Payment.create(paymentData);
};

// Find Payment By ID
const findPaymentById = async (paymentId) => {
  return await Payment.findById(paymentId)
    .populate("client")
    .populate("membership")
    .populate("collectedBy");
};

// Get All Payments
const findAllPayments = async () => {
  return await Payment.find()
    .populate("client")
    .populate("membership")
    .populate("collectedBy");
};

// Get Payments By Tenant
const findPaymentsByTenant = async (tenantId) => {
  return await Payment.find({
    tenant: tenantId,
  })
    .populate("client")
    .populate("membership")
    .populate("collectedBy");
};

// Get Payments By Client
const findPaymentsByClient = async (clientId) => {
  return await Payment.find({
    client: clientId,
    status: "ACTIVE",
  })
    .sort({
      createdAt: -1,
    })
    .populate("membership")
    .populate("collectedBy");
};

// Update Payment
const updatePayment = async (
  paymentId,
  updateData
) => {
  return await Payment.findByIdAndUpdate(
    paymentId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Payment
const softDeletePayment = async (
  paymentId
) => {
  return await Payment.findByIdAndUpdate(
    paymentId,
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
  createPayment,
  findPaymentById,
  findAllPayments,
  findPaymentsByTenant,
  findPaymentsByClient,
  updatePayment,
  softDeletePayment,
};