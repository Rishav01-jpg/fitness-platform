import Individual from "./individual.model.js";

// Create Individual
const createIndividual = async (individualData) => {
  return await Individual.create(individualData);
};

// Find By ID
const findIndividualById = async (individualId) => {
  return await Individual.findById(individualId);
};

// Find By Email
const findIndividualByEmail = async (email) => {
  return await Individual.findOne({
    email: email.toLowerCase(),
  });
};

// Get All Individuals
const findAllIndividuals = async () => {
  return await Individual.find({
    status: "ACTIVE",
  }).sort({ createdAt: -1 });
};

// Update Individual
const updateIndividual = async (
  individualId,
  updateData
) => {
  return await Individual.findByIdAndUpdate(
    individualId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Individual
const softDeleteIndividual = async (
  individualId
) => {
  return await Individual.findByIdAndUpdate(
    individualId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export {
  createIndividual,
  findIndividualById,
  findIndividualByEmail,
  findAllIndividuals,
  updateIndividual,
  softDeleteIndividual,
};