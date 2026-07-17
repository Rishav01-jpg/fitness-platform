import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createIndividualSchema,
  updateIndividualSchema,
} from "./individual.validation.js";

import {
  createIndividualService,
  getAllIndividualsService,
  getIndividualByIdService,
  updateIndividualService,
  deleteIndividualService,
} from "./individual.service.js";

//create individual

const createIndividual = asyncHandler(
  async (req, res) => {
    const validatedData =
      createIndividualSchema.parse(req.body);

    const individual =
      await createIndividualService(
        validatedData
      );

    return successResponse(
      res,
      individual,
      "Individual profile created successfully.",
      201
    );
  }
);

//get all individuals
const getAllIndividuals = asyncHandler(
  async (req, res) => {
    const individuals =
      await getAllIndividualsService();

    return successResponse(
      res,
      individuals,
      "Individuals fetched successfully."
    );
  }
);

//get individual by id 
const getIndividualById = asyncHandler(
  async (req, res) => {
    const { individualId } = req.params;

    const individual =
      await getIndividualByIdService(
        individualId
      );

    return successResponse(
      res,
      individual,
      "Individual fetched successfully."
    );
  }
);

//update individual
const updateIndividual = asyncHandler(
  async (req, res) => {
    const { individualId } = req.params;

    const validatedData =
      updateIndividualSchema.parse(req.body);

    const individual =
      await updateIndividualService(
        individualId,
        validatedData
      );

    return successResponse(
      res,
      individual,
      "Individual profile updated successfully."
    );
  }
);

//soft delete individual
const deleteIndividual = asyncHandler(
  async (req, res) => {
    const { individualId } = req.params;

    const individual =
      await deleteIndividualService(
        individualId
      );

    return successResponse(
      res,
      individual,
      "Individual profile deleted successfully."
    );
  }
);

export {
  createIndividual,
  getAllIndividuals,
  getIndividualById,
  updateIndividual,
  deleteIndividual,
};