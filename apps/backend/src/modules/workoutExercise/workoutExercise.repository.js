import WorkoutExercise from "./workoutExercise.model.js";

// Create Workout Exercise
const createWorkoutExercise = async (data) => {
  return await WorkoutExercise.create(data);
};

// Find By ID
const findWorkoutExerciseById = async (id) => {
  return await WorkoutExercise.findById(id)
    .populate("exercise")
    .populate("workout");
};

// Get All
const findAllWorkoutExercises = async () => {
  return await WorkoutExercise.find()
    .populate("exercise")
    .populate("workout");
};

// Get By Tenant
const findWorkoutExercisesByTenant = async (
  tenantId
) => {
  return await WorkoutExercise.find({
    tenant: tenantId,
  })
    .populate("exercise")
    .populate("workout");
};

// Get By Workout
const findWorkoutExercisesByWorkout = async (
  workoutId
) => {
  return await WorkoutExercise.find({
    workout: workoutId,
    status: "ACTIVE",
  })
    .populate("exercise")
    .sort({
      exerciseOrder: 1,
    });
};

// Update
const updateWorkoutExercise = async (
  id,
  updateData
) => {
  return await WorkoutExercise.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete
const softDeleteWorkoutExercise = async (id) => {
  return await WorkoutExercise.findByIdAndUpdate(
    id,
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
  createWorkoutExercise,
  findWorkoutExerciseById,
  findAllWorkoutExercises,
  findWorkoutExercisesByTenant,
  findWorkoutExercisesByWorkout,
  updateWorkoutExercise,
  softDeleteWorkoutExercise,
};