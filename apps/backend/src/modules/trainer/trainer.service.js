import AppError from "../../shared/errors/AppError.js";

import Dashboard from "../dashboard/dashboard.model.js";

import { ROLES } from "../../constants/roles.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

import {
  createTrainer,
  findTrainerById,
  findTrainerByEmail,
  findTrainerByPhone,
  findAllTrainers,
  findTrainersByTenant,
  updateTrainer,
  softDeleteTrainer,
  findTrainerForLogin,
updateTrainerPassword,
} from "./trainer.repository.js";

//create trainer
const createTrainerService = async (
  trainerData,
  user
) => {
  // Check dashboard
  const dashboard = await Dashboard.findById(
    trainerData.dashboard
  );

  if (!dashboard) {
    throw new AppError("Dashboard not found.", 404);
  }

  // Dashboard must belong to logged-in tenant
  if (
    dashboard.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Duplicate email
  const existingEmail = await findTrainerByEmail(
    trainerData.email
  );

  if (existingEmail) {
    throw new AppError(
      "Trainer email already exists.",
      409
    );
  }

  // Duplicate phone
  const existingPhone = await findTrainerByPhone(
    trainerData.phone
  );

  if (existingPhone) {
    throw new AppError(
      "Trainer phone already exists.",
      409
    );
  }

  // Create trainer
 const hashedPassword = await bcrypt.hash(
  trainerData.password,
  10
);

const trainer = await createTrainer({
  ...trainerData,
  password: hashedPassword,
  tenant: user.tenantId,
});

const trainerObject = trainer.toObject();

delete trainerObject.password;
delete trainerObject.__v;

return trainerObject;
};
// Trainer login
const loginTrainerService = async (loginData) => {
  const { email, phone, password } = loginData;

  const trainer = await findTrainerForLogin({
    email,
    phone,
  });

  if (!trainer) {
    throw new AppError(
      "Invalid email/phone or password.",
      401
    );
  }

  // Check trainer status
  if (trainer.status !== "ACTIVE") {
    throw new AppError(
      "Trainer account is inactive.",
      403
    );
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(
    password,
    trainer.password
  );

  if (!isPasswordMatch) {
    throw new AppError(
      "Invalid email/phone or password.",
      401
    );
  }

  // Generate JWT
  const token = generateToken({
    userId: trainer._id,
    role: ROLES.TRAINER,
    tenantId: trainer.tenant,
    dashboardId: trainer.dashboard,
  });

  // Remove password from response
  const trainerObject = trainer.toObject();
  delete trainerObject.password;

  return {
    trainer: trainerObject,
    token,
  };
};
// Get logged-in trainer profile
const getTrainerProfileService = async (user) => {
  const trainer = await findTrainerById(user._id);

  if (!trainer) {
    throw new AppError(
      "Trainer not found.",
      404
    );
  }

  return trainer;
};
// Update logged-in trainer profile
const updateTrainerProfileService = async (
  user,
  updateData
) => {
  const trainer = await findTrainerById(user._id);

  if (!trainer) {
    throw new AppError(
      "Trainer not found.",
      404
    );
  }

  // Check duplicate phone
  if (
    updateData.phone &&
    updateData.phone !== trainer.phone
  ) {
    const existingPhone =
      await findTrainerByPhone(updateData.phone);

    if (existingPhone) {
      throw new AppError(
        "Phone number already exists.",
        409
      );
    }
  }

  return await updateTrainer(
    trainer._id,
    updateData
  );
};
//get all trainers
const getAllTrainersService = async (user) => {
  // Super Admin
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllTrainers();
  }

  // Tenant Admin
  return await findTrainersByTenant(user.tenantId);
};

//get trainer by id
const getTrainerByIdService = async (
  trainerId,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can access everything
  if (user.role === ROLES.SUPER_ADMIN) {
    return trainer;
  }

  // Tenant Admin can access only own trainers
  if (
    trainer.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return trainer;
};


//update trainer
const updateTrainerService = async (
  trainerId,
  updateData,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can update any trainer
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      trainer.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Duplicate email
  if (
    updateData.email &&
    updateData.email !== trainer.email
  ) {
    const existingEmail = await findTrainerByEmail(
      updateData.email
    );

    if (existingEmail) {
      throw new AppError(
        "Trainer email already exists.",
        409
      );
    }
  }

  // Duplicate phone
  if (
    updateData.phone &&
    updateData.phone !== trainer.phone
  ) {
    const existingPhone = await findTrainerByPhone(
      updateData.phone
    );

    if (existingPhone) {
      throw new AppError(
        "Trainer phone already exists.",
        409
      );
    }
  }

  return await updateTrainer(
    trainerId,
    updateData
  );
};

//soft selete trainer 
const softDeleteTrainerService = async (
  trainerId,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Super Admin can delete any trainer
  if (user.role !== ROLES.SUPER_ADMIN) {
    if (
      trainer.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  return await softDeleteTrainer(trainerId);
};

// Trainer change own password
const changeTrainerPasswordService = async (
  user,
  passwordData
) => {
  const { currentPassword, newPassword } =
    passwordData;

  // Need password because it has select: false
  const trainer = await findTrainerForLogin({
    email: user.email,
  });

  if (!trainer) {
    throw new AppError(
      "Trainer not found.",
      404
    );
  }

  // Verify current password
  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    trainer.password
  );

  if (!isPasswordMatch) {
    throw new AppError(
      "Current password is incorrect.",
      400
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await updateTrainerPassword(
    trainer._id,
    hashedPassword
  );

  return;
};

// Admin reset trainer password
const resetTrainerPasswordService = async (
  trainerId,
  newPassword,
  user
) => {
  const trainer = await findTrainerById(trainerId);

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Admin can reset only trainers from own tenant
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    trainer.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await updateTrainerPassword(
    trainerId,
    hashedPassword
  );

  return;
};
export {
  createTrainerService,
  loginTrainerService,
  getTrainerProfileService,
  updateTrainerProfileService,
  changeTrainerPasswordService,
  resetTrainerPasswordService,
  getAllTrainersService,
  getTrainerByIdService,
  updateTrainerService,
  softDeleteTrainerService,
};