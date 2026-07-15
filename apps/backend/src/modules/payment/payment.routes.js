import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "./payment.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_PAYMENT),
  getAllPayments
);

router.get(
  "/:paymentId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_PAYMENT),
  getPaymentById
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.CREATE_PAYMENT),
  checkTenantStatus,
  checkSubscription,
  createPayment
);

router.put(
  "/:paymentId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.UPDATE_PAYMENT),
  checkTenantStatus,
  checkSubscription,
  updatePayment
);

router.delete(
  "/:paymentId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_PAYMENT),
  checkTenantStatus,
  checkSubscription,
  deletePayment
);

export default router;