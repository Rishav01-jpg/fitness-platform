import express from "express";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  softDeleteTenant,
} from "./tenant.controller.js";

const router = express.Router();

//create tenant
router.post(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.CREATE_TENANT),
  createTenant
);
//get all tenants
router.get(
  "/",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.VIEW_TENANT),
  getAllTenants
);

//get tenant by id
router.get(
  "/:tenantId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.VIEW_TENANT),
  getTenantById
);

//update tenant
router.put(
  "/:tenantId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.UPDATE_TENANT),
  updateTenant
);

//soft delete tenant
router.delete(
  "/:tenantId",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  hasPermission(PERMISSIONS.DELETE_TENANT),
  softDeleteTenant
);

export default router;