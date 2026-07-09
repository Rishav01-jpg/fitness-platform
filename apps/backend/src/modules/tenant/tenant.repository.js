import Tenant from "./tenant.model.js";

const createTenant = async (tenantData) => {
  return await Tenant.create(tenantData);
};

const findTenantById = async (tenantId) => {
  return await Tenant.findById(tenantId);
};

const findTenantByEmail = async (email) => {
  return await Tenant.findOne({ email });
};

const findTenantByPhone = async (phone) => {
  return await Tenant.findOne({ phone });
};

const findAllTenants = async () => {
  return await Tenant.find();
};

const updateTenant = async (tenantId, updateData) => {
  return await Tenant.findByIdAndUpdate(
    tenantId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteTenant = async (tenantId) => {
  return await Tenant.findByIdAndDelete(tenantId);
};

const softDeleteTenant = async (tenantId) => {
  return await Tenant.findByIdAndUpdate(
    tenantId,
    {
      status: "inactive",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createTenant,
  findTenantById,
  findTenantByEmail,
  findTenantByPhone,
  findAllTenants,
  updateTenant,
  deleteTenant,
  softDeleteTenant,
};