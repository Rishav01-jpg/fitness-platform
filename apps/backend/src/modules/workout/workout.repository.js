import Workout from "./workout.model.js";

// Create workout
const createWorkout = async (workoutData) => {
  return await Workout.create(workoutData);
};

// Find workout by ID
const findWorkoutById = async (workoutId) => {
  return await Workout.findById(workoutId);
};

// Get all workouts
const findAllWorkouts = async () => {
  return await Workout.find();
};

// Get workouts by tenant
const findWorkoutsByTenant = async (tenantId) => {
  return await Workout.find({ tenant: tenantId });
};

// Get workouts by dashboard
const findWorkoutsByDashboard = async (dashboardId) => {
  return await Workout.find({ dashboard: dashboardId });
};

// Get workouts by trainer
const findWorkoutsByTrainer = async (trainerId) => {
  return await Workout.find({ trainer: trainerId });
};

// Get workouts by client
const findWorkoutsByClient = async (clientId) => {
  return await Workout.find({ client: clientId });
};

// Update workout
const updateWorkout = async (
  workoutId,
  updateData
) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft delete workout
const softDeleteWorkout = async (workoutId) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
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
  createWorkout,
  findWorkoutById,
  findAllWorkouts,
  findWorkoutsByTenant,
  findWorkoutsByDashboard,
  findWorkoutsByTrainer,
  findWorkoutsByClient,
  updateWorkout,
  softDeleteWorkout,
};