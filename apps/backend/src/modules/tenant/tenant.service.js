import AppError from "../../shared/errors/AppError.js";

import bcrypt from "bcrypt";
import User from "../user/user.model.js";
import { ROLES } from "../../constants/roles.js";
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
  // Check duplicate tenant email
  const existingTenantEmail = await findTenantByEmail(tenantData.email);

  if (existingTenantEmail) {
    throw new AppError("Tenant email already exists.", 409);
  }

  // Check duplicate tenant phone
  const existingTenantPhone = await findTenantByPhone(tenantData.phone);

  if (existingTenantPhone) {
    throw new AppError("Tenant phone already exists.", 409);
  }

  // Check duplicate admin email
  const existingAdminEmail = await User.findOne({
    email: tenantData.admin.email,
  });

  if (existingAdminEmail) {
    throw new AppError("Admin email already exists.", 409);
  }

  // Check duplicate admin phone
  const existingAdminPhone = await User.findOne({
    phone: tenantData.admin.phone,
  });

  if (existingAdminPhone) {
    throw new AppError("Admin phone already exists.", 409);
  }

  // Check plan
  const plan = await Plan.findById(tenantData.plan);

  if (!plan) {
    throw new AppError("Plan not found.", 404);
  }

  // Create tenant first
  const tenant = await createTenant({
    name: tenantData.name,
    email: tenantData.email,
    phone: tenantData.phone,
    plan: tenantData.plan,
    address: tenantData.address,
    city: tenantData.city,
    state: tenantData.state,
    country: tenantData.country,
    pincode: tenantData.pincode,
    timezone: tenantData.timezone,
    currency: tenantData.currency,
    logo: tenantData.logo,
  });

  // Hash admin password
  const hashedPassword = await bcrypt.hash(
    tenantData.admin.password,
    10
  );

  // Create tenant admin user
  const adminUser = await User.create({
    firstName: tenantData.admin.firstName,
    lastName: tenantData.admin.lastName,
    email: tenantData.admin.email,
    phone: tenantData.admin.phone,
    password: hashedPassword,
    role: ROLES.ADMIN,
    tenantId: tenant._id,
  });

  // Link tenant to admin
  tenant.owner = adminUser._id;

  await tenant.save();

  return tenant;
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