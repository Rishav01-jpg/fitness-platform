import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../database/mongodb.js";
import Plan from "../modules/plan/plan.model.js";

dotenv.config();

const seedPlans = async () => {
  try {
    await connectDB();

    await Plan.deleteMany({});

    await Plan.insertMany([
      {
        name: "BASIC",
        price: 5000,
        billingCycle: "YEARLY",
        dashboardLimit: 1,
        unlimitedDashboards: false,
        unlimitedClients: true,
        unlimitedTrainers: true,
        unlimitedDietitians: true,
      },
      {
        name: "PRO",
        price: 10000,
        billingCycle: "YEARLY",
        dashboardLimit: 2,
        unlimitedDashboards: false,
        unlimitedClients: true,
        unlimitedTrainers: true,
        unlimitedDietitians: true,
      },
      {
        name: "ENTERPRISE",
        price: 20000,
        billingCycle: "YEARLY",
        dashboardLimit: 0,
        unlimitedDashboards: true,
        unlimitedClients: true,
        unlimitedTrainers: true,
        unlimitedDietitians: true,
      },
    ]);

    console.log("✅ Plans seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    process.exit(1);
  }
};

seedPlans();