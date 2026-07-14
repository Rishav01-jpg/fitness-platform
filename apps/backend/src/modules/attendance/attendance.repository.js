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
};