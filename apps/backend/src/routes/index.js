import express from "express";
import healthRoutes from "./health.routes.js";
import userRoutes from "../modules/user/user.routes.js";

const router = express.Router();

router.use(healthRoutes);
router.use("/users", userRoutes);

export default router;