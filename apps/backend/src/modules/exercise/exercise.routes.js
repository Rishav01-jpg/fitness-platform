import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "./exercise.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_EXERCISE),
  getAllExercises
);

router.get(
  "/:exerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_EXERCISE),
  getExerciseById
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  hasPermission(PERMISSIONS.CREATE_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  createExercise
);

router.put(
  "/:exerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.UPDATE_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  updateExercise
);

router.delete(
  "/:exerciseId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_EXERCISE),
  checkTenantStatus,
  checkSubscription,
  deleteExercise
);

export default router;