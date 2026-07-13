import Exercise from "./exercise.model.js";

// Create Exercise
const createExercise = async (exerciseData) => {
  return await Exercise.create(exerciseData);
};

// Find Exercise By ID
const findExerciseById = async (exerciseId) => {
  return await Exercise.findById(exerciseId);
};

// Find Exercise By Name (within a tenant)
const findExerciseByName = async (
  tenantId,
  name
) => {
  return await Exercise.findOne({
    tenant: tenantId,
    name: {
      $regex: new RegExp(`^${name}$`, "i"),
    },
  });
};

// Get All Exercises
const findAllExercises = async () => {
  return await Exercise.find();
};

// Get Exercises By Tenant
const findExercisesByTenant = async (
  tenantId
) => {
  return await Exercise.find({
    tenant: tenantId,
  });
};

// Update Exercise
const updateExercise = async (
  exerciseId,
  updateData
) => {
  return await Exercise.findByIdAndUpdate(
    exerciseId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Exercise
const softDeleteExercise = async (
  exerciseId
) => {
  return await Exercise.findByIdAndUpdate(
    exerciseId,
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
  createExercise,
  findExerciseById,
  findExerciseByName,
  findAllExercises,
  findExercisesByTenant,
  updateExercise,
  softDeleteExercise,
};