import User from "./user.model.js";
import { ROLES } from "../../constants/roles.js";
import { STATUS } from "../../constants/status.js";

//
// Find user by ID
//
const findUserById = async (userId) => {
  return await User.findById(userId).select(
    "-password -resetPasswordToken -resetPasswordExpires -__v"
  );
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

//
// Find users with filter
//
const findUsers = async (
  filter,
  options = {}
) => {
  const {
    skip = 0,
    limit = 10,
    sort = { createdAt: -1 },
  } = options;

  return await User.find(filter)
  .select("-password -resetPasswordToken -resetPasswordExpires -__v")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};
//
// Count users
//
const countUsers = async (filter) => {
  return await User.countDocuments(filter);
};


export {
  findUserById,
  findUserByEmail,
  findUsersByTenant,
  findTenantAdmins,
  findUsers,
  countUsers,
};