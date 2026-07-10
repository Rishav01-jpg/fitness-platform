import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  softDeleteTrainer,
} from "./trainer.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_TRAINER),
  getAllTrainers
);

router.get(
  "/:trainerId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.VIEW_TRAINER),
  getTrainerById
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  hasPermission(PERMISSIONS.CREATE_TRAINER),
  checkTenantStatus,
  checkSubscription,
  createTrainer
);

router.put(
  "/:trainerId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.UPDATE_TRAINER),
  checkTenantStatus,
  checkSubscription,
  updateTrainer
);

router.delete(
  "/:trainerId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  hasPermission(PERMISSIONS.DELETE_TRAINER),
  checkTenantStatus,
  checkSubscription,
  softDeleteTrainer
);
export default router;