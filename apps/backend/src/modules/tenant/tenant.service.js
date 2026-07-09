import AppError from "../../shared/errors/AppError.js";

import User from "../user/user.model.js";
import Plan from "../plan/plan.model.js";


import {
  createTenant,
  findTenantById,
  findTenantByEmail,
  findTenantByPhone,
  findAllTenants,
  updateTenant,
  softDeleteTenant,
} from "./tenant.repository.js";

const createTenantService = async (tenantData) => {
  // Check duplicate email
  const existingEmail = await findTenantByEmail(tenantData.email);

  if (existingEmail) {
    throw new AppError("Tenant email already exists.", 409);
  }

  // Check duplicate phone
  const existingPhone = await findTenantByPhone(tenantData.phone);

  if (existingPhone) {
    throw new AppError("Tenant phone already exists.", 409);
  }

  // Check owner
  const owner = await User.findById(tenantData.owner);

  if (!owner) {
    throw new AppError("Owner not found.", 404);
  }

  // Check plan
  const plan = await Plan.findById(tenantData.plan);

  if (!plan) {
    throw new AppError("Plan not found.", 404);
  }

  // Create tenant
  return await createTenant(tenantData);
};

//get all tenants
const getAllTenantsService = async () => {
  return await findAllTenants();
};

//get tenant by id
const getTenantByIdService = async (tenantId) => {
  const tenant = await findTenantById(tenantId);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  return tenant;
};

//update tenant
const updateTenantService = async (tenantId, updateData) => {
  const tenant = await findTenantById(tenantId);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  // Check duplicate email
  if (updateData.email && updateData.email !== tenant.email) {
    const existingEmail = await findTenantByEmail(updateData.email);

    if (existingEmail) {
      throw new AppError("Tenant email already exists.", 409);
    }
  }

  // Check duplicate phone
  if (updateData.phone && updateData.phone !== tenant.phone) {
    const existingPhone = await findTenantByPhone(updateData.phone);

    if (existingPhone) {
      throw new AppError("Tenant phone already exists.", 409);
    }
  }

  return await updateTenant(tenantId, updateData);
};

//soft delete tenant
const softDeleteTenantService = async (tenantId) => {
  const tenant = await findTenantById(tenantId);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  return await softDeleteTenant(tenantId);
};


export {
  createTenantService,
  getAllTenantsService,
  getTenantByIdService,
  updateTenantService,
  softDeleteTenantService,
};