import User from "./user.model.js";
import { ROLES } from "../../constants/roles.js";
import { STATUS } from "../../constants/status.js";

//
// Find user by ID
//
const findUserById = async (userId) => {
  return await User.findById(userId);
};

//
// Find user by email
//
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

//
// Find users by tenant
//
const findUsersByTenant = async (tenantId) => {
  return await User.find({
    tenantId,
  });
};

//
// Find tenant admins
//
const findTenantAdmins = async (tenantId) => {
  return await User.find({
    tenantId,
    role: ROLES.ADMIN,
status: STATUS.ACTIVE,
  });
};

export {
  findUserById,
  findUserByEmail,
  findUsersByTenant,
  findTenantAdmins,
};