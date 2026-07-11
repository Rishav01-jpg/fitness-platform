import asyncHandler from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/responses/successResponse.js";

import {
  createMembershipSchema,
  updateMembershipSchema,
} from "./membership.validation.js";

import {
  createMembershipService,
  getAllMembershipsService,
  getMembershipByIdService,
  updateMembershipService,
  cancelMembershipService,
} from "./membership.service.js";

const createMembership = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData =
    createMembershipSchema.parse(req.body);

  // Create membership
  const membership =
    await createMembershipService(
      validatedData,
      req.user
    );

  return successResponse(
    res,
    membership,
    "Membership created successfully.",
    201
  );
});

//get all memberships of tenant
const getAllMemberships = asyncHandler(async (req, res) => {
  const memberships = await getAllMembershipsService(req.user);

  return successResponse(
    res,
    memberships,
    "Memberships fetched successfully."
  );
});

//get membership by id
const getMembershipById = asyncHandler(
  async (req, res) => {
    const { membershipId } = req.params;

    const membership =
      await getMembershipByIdService(
        membershipId,
        req.user
      );

    return successResponse(
      res,
      membership,
      "Membership fetched successfully."
    );
  }
);

//update membership
const updateMembership = asyncHandler(
  async (req, res) => {
    const { membershipId } = req.params;

    const validatedData =
      updateMembershipSchema.parse(req.body);

    const membership =
      await updateMembershipService(
        membershipId,
        validatedData,
        req.user
      );

    return successResponse(
      res,
      membership,
      "Membership updated successfully."
    );
  }
);

//cencel memberships
const cancelMembership = asyncHandler(
  async (req, res) => {
    const { membershipId } = req.params;

    const membership =
      await cancelMembershipService(
        membershipId,
        req.user
      );

    return successResponse(
      res,
      membership,
      "Membership cancelled successfully."
    );
  }
);

export {
  createMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
  cancelMembership,
};