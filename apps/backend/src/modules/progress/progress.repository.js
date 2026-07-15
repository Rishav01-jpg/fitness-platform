import Progress from "./progress.model.js";

// Create Progress
const createProgress = async (progressData) => {
  return await Progress.create(progressData);
};

// Find Progress By ID
const findProgressById = async (progressId) => {
  return await Progress.findById(progressId)
    .populate("client")
    .populate("trainer");
};

// Get All Progress
const findAllProgress = async () => {
  return await Progress.find()
    .populate("client")
    .populate("trainer");
};

// Get Progress By Tenant
const findProgressByTenant = async (tenantId) => {
  return await Progress.find({
    tenant: tenantId,
  })
    .populate("client")
    .populate("trainer");
};

// Get Progress By Client
const findProgressByClient = async (clientId) => {
  return await Progress.find({
    client: clientId,
    status: "ACTIVE",
  })
    .sort({
      recordedDate: -1,
    })
    .populate("trainer");
};

// Update Progress
const updateProgress = async (
  progressId,
  updateData
) => {
  return await Progress.findByIdAndUpdate(
    progressId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Progress
const softDeleteProgress = async (
  progressId
) => {
  return await Progress.findByIdAndUpdate(
    progressId,
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
  createProgress,
  findProgressById,
  findAllProgress,
  findProgressByTenant,
  findProgressByClient,
  updateProgress,
  softDeleteProgress,
};