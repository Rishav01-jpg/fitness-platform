import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createPaymentSchema,
  updatePaymentSchema,
} from "./payment.validation.js";

import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
} from "./payment.service.js";

const createPayment = asyncHandler(
  async (req, res) => {
    const validatedData =
      createPaymentSchema.parse(req.body);

    const payment =
      await createPaymentService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      payment,
      "Payment created successfully.",
      201
    );
  }
);

//get all payments 
const getAllPayments = asyncHandler(
  async (req, res) => {
    const payments =
      await getAllPaymentsService(req.user);

    return successResponse(
      res,
      payments,
      "Payments fetched successfully."
    );
  }
);

//get payment by id
const getPaymentById = asyncHandler(
  async (req, res) => {
    const { paymentId } = req.params;

    const payment =
      await getPaymentByIdService(
        paymentId,
        req.user
      );

    return successResponse(
      res,
      payment,
      "Payment fetched successfully."
    );
  }
);

//update payment 
const updatePayment = asyncHandler(
  async (req, res) => {
    const { paymentId } = req.params;

    const validatedData =
      updatePaymentSchema.parse(req.body);

    const payment =
      await updatePaymentService(
        paymentId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      payment,
      "Payment updated successfully."
    );
  }
);

//soft delete payment
const deletePayment = asyncHandler(
  async (req, res) => {
    const { paymentId } = req.params;

    const payment =
      await deletePaymentService(
        paymentId,
        req.user
      );

    return successResponse(
      res,
      payment,
      "Payment deleted successfully."
    );
  }
);

export {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};