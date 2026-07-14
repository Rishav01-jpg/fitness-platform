import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createWorkoutExercise,
  getWorkoutExercises,
  getWorkoutExerciseById,
  updateWorkoutExercise,
  deleteWorkoutExercise,
} from "./workoutExercise.controller.js";

const router = express.Router();

router.get(
  "/workout/:workoutId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_WORKOUT_EXERCISE),
  getWorkoutExercises
);

router.get(
  "/:workoutExerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_WORKOUT),
  getWorkoutExerciseById
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.CREATE_WORKOUT_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  createWorkoutExercise
);

router.put(
  "/:workoutExerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.UPDATE_WORKOUT_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  updateWorkoutExercise
);

router.delete(
  "/:workoutExerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.DELETE_WORKOUT_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  deleteWorkoutExercise
);

export default router;