import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";
import checkTenantStatus from "../../middlewares/tenantStatus.middleware.js";
import checkSubscription from "../../middlewares/subscription.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "./invoice.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_INVOICE),
  getAllInvoices
);

router.get(
  "/:invoiceId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.TRAINER
  ),
  hasPermission(PERMISSIONS.VIEW_INVOICE),
  getInvoiceById
);

router.post(
  "/",
  authenticate,
  authorize(
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.CREATE_INVOICE),
  checkTenantStatus,
  checkSubscription,
  createInvoice
);

router.put(
  "/:invoiceId",
  authenticate,
 authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.UPDATE_INVOICE),
  checkTenantStatus,
  checkSubscription,
  updateInvoice
);

router.delete(
  "/:invoiceId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.DELETE_INVOICE),
  checkTenantStatus,
  checkSubscription,
  deleteInvoice
);

export default router;