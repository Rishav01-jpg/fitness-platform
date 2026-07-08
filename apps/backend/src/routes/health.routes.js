import express from "express";
import successResponse from "../shared/responses/successResponse.js";
import asyncHandler from "../shared/utils/asyncHandler.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        timestamp: new Date().toISOString(),
      },
      "Fitness SaaS API is running successfully"
    );
  })
);

router.get(
  "/protected",
  authenticate,
  (req, res) => {
    return successResponse(
      res,
      req.user,
      "Protected route accessed successfully"
    );
  }
);

router.get(
  "/admin",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
),
  (req, res) => {
    return successResponse(
      res,
      {
        user: req.user.email,
      },
      "Welcome Admin"
    );
  }
);

export default router;