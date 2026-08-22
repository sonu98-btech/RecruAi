import authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const data = await authService.listMembers(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Users fetched", data });
});

export const createUser = asyncHandler(async (req, res) => {
  const data = await authService.createMember(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "User created", data });
});

export const updateUser = asyncHandler(async (req, res) => {
  const data = await authService.updateMember(req.user, req.params.id, req.body);
  return ApiResponse.success(res, { message: "User updated", data });
});
