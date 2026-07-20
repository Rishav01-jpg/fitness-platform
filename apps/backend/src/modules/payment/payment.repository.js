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

// Get payments due between two dates
const findPaymentsDueBetween = async (
  startDate,
  endDate
) => {
  return await Payment.find({
  status: "ACTIVE",
  paymentStatus: {
    $in: ["PENDING", "PARTIAL"],
  },
  dueDate: {
    $gte: startDate,
    $lte: endDate,
  },
})
  .populate("client")
  .populate("membership");
};

// Get today's revenue
const getTodayRevenue = async (
  tenantId
) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const result = await Payment.aggregate([
    {
      $match: {
        tenant: tenantId,
        paymentStatus: "PAID",
        paidDate: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$paidAmount",
        },
      },
    },
  ]);

  return result.length
    ? result[0].totalRevenue
    : 0;
};
// Count pending payments
const countPendingPayments = async (
  tenantId
) => {
  return await Payment.countDocuments({
    tenant: tenantId,
    paymentStatus: {
      $in: ["PENDING", "PARTIAL"],
    },
    status: "ACTIVE",
  });
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

// Update payment reminder timestamp
const updatePaymentReminder = async (
  paymentId
) => {
  return await Payment.findByIdAndUpdate(
    paymentId,
    {
      lastReminderSentAt: new Date(),
    },
    {
      new: true,
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
  findPaymentsDueBetween,
updatePaymentReminder,
getTodayRevenue,
countPendingPayments,
};