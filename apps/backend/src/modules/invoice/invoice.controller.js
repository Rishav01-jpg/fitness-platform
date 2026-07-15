import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "./invoice.validation.js";

import {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
} from "./invoice.service.js";

const createInvoice = asyncHandler(
  async (req, res) => {
    const validatedData =
      createInvoiceSchema.parse(req.body);

    const invoice =
      await createInvoiceService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      invoice,
      "Invoice created successfully.",
      201
    );
  }
);

//get all invoices
const getAllInvoices = asyncHandler(
  async (req, res) => {
    const invoices =
      await getAllInvoicesService(req.user);

    return successResponse(
      res,
      invoices,
      "Invoices fetched successfully."
    );
  }
);

//get invoices by id
const getInvoiceById = asyncHandler(
  async (req, res) => {
    const { invoiceId } = req.params;

    const invoice =
      await getInvoiceByIdService(
        invoiceId,
        req.user
      );

    return successResponse(
      res,
      invoice,
      "Invoice fetched successfully."
    );
  }
);

//update invoice 
const updateInvoice = asyncHandler(
  async (req, res) => {
    const { invoiceId } = req.params;

    const validatedData =
      updateInvoiceSchema.parse(req.body);

    const invoice =
      await updateInvoiceService(
        invoiceId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      invoice,
      "Invoice updated successfully."
    );
  }
);

//soft delete invoice
const deleteInvoice = asyncHandler(
  async (req, res) => {
    const { invoiceId } = req.params;

    const invoice =
      await deleteInvoiceService(
        invoiceId,
        req.user
      );

    return successResponse(
      res,
      invoice,
      "Invoice deleted successfully."
    );
  }
);

export {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};