import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);

    console.log("=================================");
    console.log("✅ MongoDB Connected");
    console.log(`📦 Database: ${connection.connection.name}`);
    console.log(`🖥️ Host: ${connection.connection.host}`);
    console.log("=================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;