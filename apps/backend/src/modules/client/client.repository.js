import Client from "./client.model.js";

// Create client
const createClient = async (clientData) => {
  return await Client.create(clientData);
};

// Find client by ID
const findClientById = async (clientId) => {
  return await Client.findById(clientId);
};

// Find client by email
const findClientByEmail = async (email) => {
  return await Client.findOne({ email });
};

// Find client by phone
const findClientByPhone = async (phone) => {
  return await Client.findOne({ phone });
};

// Get all clients
const findAllClients = async () => {
  return await Client.find();
};

// Get clients by tenant
const findClientsByTenant = async (tenantId) => {
  return await Client.find({ tenant: tenantId });
};

// Get clients by dashboard
const findClientsByDashboard = async (dashboardId) => {
  return await Client.find({ dashboard: dashboardId });
};

// Get clients by trainer
const findClientsByTrainer = async (trainerId) => {
  return await Client.find({ trainer: trainerId });
};

// Get clients by dietitian
const findClientsByDietitian = async (dietitianId) => {
  return await Client.find({ dietitian: dietitianId });
};

// Update client
const updateClient = async (clientId, updateData) => {
  return await Client.findByIdAndUpdate(
    clientId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft delete client
const softDeleteClient = async (clientId) => {
  return await Client.findByIdAndUpdate(
    clientId,
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
  createClient,
  findClientById,
  findClientByEmail,
  findClientByPhone,
  findAllClients,
  findClientsByTenant,
  findClientsByDashboard,
  findClientsByTrainer,
  findClientsByDietitian,
  updateClient,
  softDeleteClient,
};