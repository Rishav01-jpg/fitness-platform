import Attendance from "./attendance.model.js";

// Create Attendance
const createAttendance = async (attendanceData) => {
  return await Attendance.create(attendanceData);
};

// Find Attendance By ID
const findAttendanceById = async (attendanceId) => {
  return await Attendance.findById(attendanceId)
    .populate("client")
    .populate("trainer")
    .populate("membership")
    .populate("workout");
};

// Get All Attendance
const findAllAttendance = async () => {
  return await Attendance.find()
    .populate("client")
    .populate("trainer")
    .populate("membership")
    .populate("workout");
};

// Get Attendance By Tenant
const findAttendanceByTenant = async (tenantId) => {
  return await Attendance.find({
    tenant: tenantId,
  })
    .populate("client")
    .populate("trainer")
    .populate("membership")
    .populate("workout");
};

// Find Client Attendance On Date
const findClientAttendanceOnDate = async (
  clientId,
  attendanceDate
) => {
  return await Attendance.findOne({
    client: clientId,
    attendanceDate,
    status: "ACTIVE",
  });
};

// Find inactive clients based on last attendance
const findInactiveClients = async (
  inactiveDays = 30
) => {
  const cutoffDate = new Date();

  cutoffDate.setDate(
    cutoffDate.getDate() - inactiveDays
  );

  return await Attendance.aggregate([
  {
    $match: {
      status: "ACTIVE",
    },
  },

  {
    $sort: {
      attendanceDate: -1,
    },
  },

  {
    $group: {
      _id: "$client",

      tenant: {
        $first: "$tenant",
      },

      lastAttendance: {
        $first: "$attendanceDate",
      },
    },
  },

  {
    $match: {
      lastAttendance: {
        $lt: cutoffDate,
      },
    },
  },

  {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "_id",
      as: "client",
    },
  },

  {
    $unwind: "$client",
  },

  {
    $project: {
      tenant: 1,
      lastAttendance: 1,

      client: {
        firstName: "$client.firstName",
        lastName: "$client.lastName",
        phone: "$client.phone",
        email: "$client.email",
      },
    },
  },
]);
};

// Count today's attendance
const countTodayAttendance = async (
  tenantId
) => {
  const start = new Date();

  start.setHours(0, 0, 0, 0);

  const end = new Date();

  end.setHours(23, 59, 59, 999);

  return await Attendance.countDocuments({
    tenant: tenantId,

    status: "ACTIVE",

    attendanceStatus: "PRESENT",

    attendanceDate: {
      $gte: start,
      $lte: end,
    },
  });
};

// Update Attendance
const updateAttendance = async (
  attendanceId,
  updateData
) => {
  return await Attendance.findByIdAndUpdate(
    attendanceId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Soft Delete Attendance
const softDeleteAttendance = async (
  attendanceId
) => {
  return await Attendance.findByIdAndUpdate(
    attendanceId,
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
  createAttendance,
  findAttendanceById,
  findAllAttendance,
  findAttendanceByTenant,
  findClientAttendanceOnDate,
  updateAttendance,
  softDeleteAttendance,
  findInactiveClients,
  countTodayAttendance,
};