import express from "express";
import healthRoutes from "./health.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import tenantRoutes from "../modules/tenant/index.js";
import dashboardRoutes from "../modules/dashboard/index.js";
import subscriptionRoutes from "../modules/subscription/index.js";
import trainerRoutes from "../modules/trainer/index.js";
import dietitianRoutes from "../modules/dietitian/index.js";
import clientRoutes from "../modules/client/index.js";
import membershipRoutes from "../modules/membership/index.js";
import workoutRoutes from "../modules/workout/index.js";
import exerciseRoutes from "../modules/exercise/index.js";

const router = express.Router();

router.use(healthRoutes);
router.use("/users", userRoutes);
router.use("/tenants", tenantRoutes);
router.use("/dashboards", dashboardRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/trainers", trainerRoutes);
router.use("/dietitians", dietitianRoutes);
router.use("/clients", clientRoutes);
router.use("/memberships", membershipRoutes);
router.use("/workouts", workoutRoutes);
router.use("/exercises", exerciseRoutes);
export default router;