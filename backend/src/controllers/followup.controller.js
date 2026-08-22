import followupService from "../services/followup.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFollowup = asyncHandler(async (req, res) => {
  const data = await followupService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Follow-up created", data });
});

export const listFollowups = asyncHandler(async (req, res) => {
  const data = await followupService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Follow-ups fetched", data });
});

export const updateFollowup = asyncHandler(async (req, res) => {
  const data = await followupService.update(req.tenant.companyId, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Follow-up updated", data });
});
