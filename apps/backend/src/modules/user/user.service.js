import bcrypt from "bcrypt";
import User from "./user.model.js";
import AppError from "../../shared/errors/AppError.js";
import { generateToken } from "../../utils/jwt.js";

const registerUser = async (userData) => {
  const { email, phone, password } = userData;

  // Check email
  if (email) {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }
  }

  // Check phone
  if (phone) {
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      throw new AppError("Phone number already exists", 409);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

// Login User
const loginUser = async (loginData) => {
  const { email, phone, password } = loginData;

  let user;

  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ phone });
  }

  if (!user) {
    throw new AppError("Invalid email/phone or password", 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid email/phone or password", 401);
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    tenantId: user.tenantId,
    dashboardId: user.dashboardId,
  });

  const userObject = user.toObject();

  delete userObject.password;

  return {
    user: userObject,
    token,
  };
};

export { registerUser, loginUser };