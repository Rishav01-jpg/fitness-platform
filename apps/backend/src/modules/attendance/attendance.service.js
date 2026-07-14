import AppError from "../../shared/errors/AppError.js";
import Client from "../client/client.model.js";
import Trainer from "../trainer/trainer.model.js";
import Membership from "../membership/membership.model.js";
import Workout from "../workout/workout.model.js";

import { ROLES } from "../../constants/roles.js";

import {
  createAttendance,
  findAttendanceById,
  findAttendanceByTenant,
  findAllAttendance,
  findClientAttendanceOnDate,
  updateAttendance,
  softDeleteAttendance,
} from "./attendance.repository.js";

const createAttendanceService = async (
  attendanceData,
  user
) => {
  // Only Admin and Trainer
  if (
    user.role !== ROLES.ADMIN &&
    user.role !== ROLES.TRAINER
  ) {
    throw new AppError(
      "Only Admin and Trainer can mark attendance.",
      403
    );
  }

  // Client
  const client = await Client.findById(
    attendanceData.client
  );

  if (!client) {
    throw new AppError("Client not found.", 404);
  }

  // Trainer
  const trainer = await Trainer.findById(
    attendanceData.trainer
  );

  if (!trainer) {
    throw new AppError("Trainer not found.", 404);
  }

  // Membership
  const membership = await Membership.findById(
    attendanceData.membership
  );

  if (!membership) {
    throw new AppError("Membership not found.", 404);
  }

  if (membership.status !== "ACTIVE") {
    throw new AppError(
      "Membership is not active.",
      400
    );
  }

  // Workout (optional)
  if (attendanceData.workout) {
    const workout = await Workout.findById(
      attendanceData.workout
    );

    if (!workout) {
      throw new AppError("Workout not found.", 404);
    }

    if (
      workout.tenant.toString() !==
      user.tenantId.toString()
    ) {
      throw new AppError("Access denied.", 403);
    }
  }

  // Tenant checks
  if (
    client.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  if (
    trainer.tenant.toString() !==
    user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Normalize attendance date (calendar day)
  const attendanceDate = new Date(
    attendanceData.attendanceDate
  );

  attendanceDate.setHours(0, 0, 0, 0);

  const existingAttendance =
    await findClientAttendanceOnDate(
      attendanceData.client,
      attendanceDate
    );

  if (existingAttendance) {
    throw new AppError(
      "Attendance already marked for today.",
      409
    );
  }

  return await createAttendance({
    ...attendanceData,
    attendanceDate,
    tenant: user.tenantId,
  });
};

//get all attendence
const getAllAttendanceService = async (user) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return await findAllAttendance();
  }

  return await findAttendanceByTenant(user.tenantId);
};

//get attendence by id
const getAttendanceByIdService = async (
  attendanceId,
  user
) => {
  const attendance = await findAttendanceById(
    attendanceId
  );

  if (!attendance) {
    throw new AppError(
      "Attendance not found.",
      404
    );
  }

  if (
    user.role !== ROLES.SUPER_ADMIN &&
    attendance.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return attendance;
};

//update attendence
const updateAttendanceService = async (
  attendanceId,
  updateData,
  user
) => {
  const attendance =
    await findAttendanceById(attendanceId);

  if (!attendance) {
    throw new AppError(
      "Attendance not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    attendance.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  // Validate workout if updated
  if (updateData.workout) {
    const workout = await Workout.findById(
      updateData.workout
    );

    if (!workout) {
      throw new AppError(
        "Workout not found.",
        404
      );
    }

    if (
      workout.tenant.toString() !==
      attendance.tenant.toString()
    ) {
      throw new AppError(
        "Access denied.",
        403
      );
    }
  }

  return await updateAttendance(
    attendanceId,
    updateData
  );
};

//soft delete attendence
const deleteAttendanceService = async (
  attendanceId,
  user
) => {
  const attendance =
    await findAttendanceById(attendanceId);

  if (!attendance) {
    throw new AppError(
      "Attendance not found.",
      404
    );
  }

  // Tenant isolation
  if (
    user.role !== ROLES.SUPER_ADMIN &&
    attendance.tenant.toString() !==
      user.tenantId.toString()
  ) {
    throw new AppError("Access denied.", 403);
  }

  return await softDeleteAttendance(
    attendanceId
  );
};

export {
  createAttendanceService,
  getAllAttendanceService,
  getAttendanceByIdService,
  updateAttendanceService,
  deleteAttendanceService,
};