import Trainer from "./trainer.model.js";

// Create trainer
const createTrainer = async (trainerData) => {
  return await Trainer.create(trainerData);
};

// Find trainer by ID
const findTrainerById = async (trainerId) => {
  return await Trainer.findById(trainerId);
};

// Find trainer by email
const findTrainerByEmail = async (email) => {
  return await Trainer.findOne({ email });
};

// Find trainer by phone
const findTrainerByPhone = async (phone) => {
  return await Trainer.findOne({ phone });
};
// Find trainer for login
const findTrainerForLogin = async ({ email, phone }) => {
  if (email) {
    return await Trainer.findOne({ email }).select("+password");
  }

  return await Trainer.findOne({ phone }).select("+password");
};
// Get all trainers
const findAllTrainers = async () => {
  return await Trainer.find();
};

// Get trainers by tenant
const findTrainersByTenant = async (tenantId) => {
  return await Trainer.find({ tenant: tenantId });
};

// Get trainers by dashboard
const findTrainersByDashboard = async (dashboardId) => {
  return await Trainer.find({ dashboard: dashboardId });
};

// Update trainer
const updateTrainer = async (trainerId, updateData) => {
  return await Trainer.findByIdAndUpdate(
    trainerId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft delete trainer
const softDeleteTrainer = async (trainerId) => {
  return await Trainer.findByIdAndUpdate(
    trainerId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
// Update trainer password
const updateTrainerPassword = async (
  trainerId,
  hashedPassword
) => {
  return await Trainer.findByIdAndUpdate(
    trainerId,
    { password: hashedPassword },
    {
      new: true,
      runValidators: true,
    }
  );
};
export {
  createTrainer,
  findTrainerById,
  findTrainerByEmail,
  findTrainerByPhone,
  findTrainerForLogin,
  findAllTrainers,
  findTrainersByTenant,
  findTrainersByDashboard,
  updateTrainer,
  updateTrainerPassword,
  softDeleteTrainer,
};