import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createTenantService,
  getAllTenantsService,
  getTenantByIdService,
  updateTenantService,
  softDeleteTenantService,
} from "./tenant.service.js";

import {
  createTenantSchema,
  updateTenantSchema,
} from "./tenant.validation.js";

const createTenant = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = createTenantSchema.parse(req.body);

  // Create tenant
  const tenant = await createTenantService(validatedData);

  return successResponse(
    res,
    tenant,
    "Tenant created successfully.",
    201
  );
});

//get all tenants
const getAllTenants = asyncHandler(async (req, res) => {
  const tenants = await getAllTenantsService();

  return successResponse(
    res,
    tenants,
    "Tenants fetched successfully."
  );
});

//get tenant by id 
const getTenantById = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  const tenant = await getTenantByIdService(tenantId);

  return successResponse(
    res,
    tenant,
    "Tenant fetched successfully."
  );
});

//update tenant
const updateTenant = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  const validatedData = updateTenantSchema.parse(req.body);

  const tenant = await updateTenantService(
    tenantId,
    validatedData
  );

  return successResponse(
    res,
    tenant,
    "Tenant updated successfully."
  );
});

//soft delete tenant
const softDeleteTenant = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  const tenant = await softDeleteTenantService(tenantId);

  return successResponse(
    res,
    tenant,
    "Tenant deactivated successfully."
  );
});

export {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  softDeleteTenant,
};