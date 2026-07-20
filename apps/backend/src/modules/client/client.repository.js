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
// Find clients whose birthday is today
const findClientsWithBirthdayToday = async () => {
  const today = new Date();

  const month = today.getMonth() + 1;
  const day = today.getDate();

  return await Client.aggregate([
    {
      $addFields: {
        birthMonth: {
          $month: "$dateOfBirth",
        },
        birthDay: {
          $dayOfMonth: "$dateOfBirth",
        },
      },
    },
    {
      $match: {
        status: "ACTIVE",
        birthMonth: month,
        birthDay: day,
      },
    },
  ]);
};

// Count today's new clients
const countNewClientsToday = async (
  tenantId
) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await Client.countDocuments({
    tenant: tenantId,
    status: "ACTIVE",
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });
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
// Update birthday wish timestamp
const updateBirthdayWishSent = async (
  clientId
) => {
  return await Client.findByIdAndUpdate(
    clientId,
    {
      lastBirthdayWishSentAt: new Date(),
    },
    {
      new: true,
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
  findClientsWithBirthdayToday,
updateBirthdayWishSent,
countNewClientsToday,
};