import app from "./app.js";
import { env } from "./config/env.js";
import connectDB from "./database/mongodb.js";
import initializeScheduler from "./modules/scheduler/index.js";

const startServer = async () => {
  try {
    await connectDB();

// Start all scheduled jobs
initializeScheduler();

app.listen(env.PORT, () => {
      console.log("=================================");
      console.log("🚀 Fitness SaaS Backend Started");
      console.log(`🌍 Server Running on Port ${env.PORT}`);
      console.log(`📅 Environment: ${env.NODE_ENV}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("Failed to start server");
    process.exit(1);
  }
};

startServer();