import { ZodError } from "zod";
import errorResponse from "../shared/responses/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return errorResponse(
      res,
      "Validation failed",
      400,
      err.issues
    );
  }

  // Handle AppError and other errors
  return errorResponse(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500
  );
};

export default errorHandler;