import express from "express";
import successResponse from "../shared/responses/successResponse.js";
import asyncHandler from "../shared/utils/asyncHandler.js";
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


export default router;