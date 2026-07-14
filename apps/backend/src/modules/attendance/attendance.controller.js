import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validation.js";

import {
  createAttendanceService,
  getAllAttendanceService,
  getAttendanceByIdService,
  updateAttendanceService,
  deleteAttendanceService,
} from "./attendance.service.js";

const createAttendance = asyncHandler(
  async (req, res) => {
    const validatedData =
      createAttendanceSchema.parse(req.body);

    const attendance =
      await createAttendanceService(
        validatedData,
        req.user
      );

    return successResponse(
      res,
      attendance,
      "Attendance marked successfully.",
      201
    );
  }
);

//get all attendence
const getAllAttendance = asyncHandler(
  async (req, res) => {
    const attendance =
      await getAllAttendanceService(req.user);

    return successResponse(
      res,
      attendance,
      "Attendance fetched successfully."
    );
  }
);

//get attendence by id
const getAttendanceById = asyncHandler(
  async (req, res) => {
    const { attendanceId } = req.params;

    const attendance =
      await getAttendanceByIdService(
        attendanceId,
        req.user
      );

    return successResponse(
      res,
      attendance,
      "Attendance fetched successfully."
    );
  }
);

//update attendence
const updateAttendance = asyncHandler(
  async (req, res) => {
    const { attendanceId } = req.params;

    const validatedData =
      updateAttendanceSchema.parse(req.body);

    const attendance =
      await updateAttendanceService(
        attendanceId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      attendance,
      "Attendance updated successfully."
    );
  }
);

//soft delete attendence
const deleteAttendance = asyncHandler(
  async (req, res) => {
    const { attendanceId } = req.params;

    const attendance =
      await deleteAttendanceService(
        attendanceId,
        req.user
      );

    return successResponse(
      res,
      attendance,
      "Attendance deleted successfully."
    );
  }
);

export {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};