import bcrypt from "bcrypt";
import User from "./user.model.js";
import AppError from "../../shared/errors/AppError.js";

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

export { registerUser };