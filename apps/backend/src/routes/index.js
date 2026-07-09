import express from "express";
import healthRoutes from "./health.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import tenantRoutes from "../modules/tenant/index.js";
import dashboardRoutes from "../modules/dashboard/index.js";
import subscriptionRoutes from "../modules/subscription/index.js";

const router = express.Router();

router.use(healthRoutes);
router.use("/users", userRoutes);
router.use("/tenants", tenantRoutes);
router.use("/dashboards", dashboardRoutes);
router.use("/subscriptions", subscriptionRoutes);
export default router;