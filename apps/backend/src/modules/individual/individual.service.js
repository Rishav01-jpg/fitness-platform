import AppError from "../../shared/errors/AppError.js";

import {
  createIndividual,
  findAllIndividuals,
  findIndividualById,
  findIndividualByEmail,
  updateIndividual,
  softDeleteIndividual,
} from "./individual.repository.js";

const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100;

  return Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(2)
  );
};
//create individual

const createIndividualService = async (
  individualData
) => {
  const existingIndividual =
    await findIndividualByEmail(
      individualData.email
    );

  if (existingIndividual) {
    throw new AppError(
      "Email already exists.",
      400
    );
  }

  const bmi = calculateBMI(
    individualData.height,
    individualData.weight
  );

  return await createIndividual({
    ...individualData,
    bmi,
  });
};
//get all individuals
const getAllIndividualsService = async () => {
  return await findAllIndividuals();
};

const getIndividualByIdService = async (
  individualId
) => {
  const individual =
    await findIndividualById(individualId);

  if (!individual) {
    throw new AppError(
      "Individual not found.",
      404
    );
  }

  return individual;
};

//update individual

const updateIndividualService = async (
  individualId,
  updateData
) => {
  const individual =
    await findIndividualById(individualId);

  if (!individual) {
    throw new AppError(
      "Individual not found.",
      404
    );
  }

  const height =
    updateData.height ?? individual.height;

  const weight =
    updateData.weight ?? individual.weight;

  const bmi = calculateBMI(
    height,
    weight
  );

  return await updateIndividual(
    individualId,
    {
      ...updateData,
      bmi,
    }
  );
};

//soft delete individual

const deleteIndividualService = async (
  individualId
) => {
  const individual =
    await findIndividualById(individualId);

  if (!individual) {
    throw new AppError(
      "Individual not found.",
      404
    );
  }

  return await softDeleteIndividual(
    individualId
  );
};
export {
  createIndividualService,
  getAllIndividualsService,
  getIndividualByIdService,
  updateIndividualService,
  deleteIndividualService,
};