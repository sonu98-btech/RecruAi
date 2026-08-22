import authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerCompany = asyncHandler(async (req, res) => {
  const result = await authService.registerCompany(req.body);
  setAuthCookie(res, result.token);
  return ApiResponse.created(res, {
    message: "Company registered",
    data: { user: result.user, company: result.company },
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.token);
  return ApiResponse.success(res, { message: "Logged in", data: { user: result.user } });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return ApiResponse.success(res, { message: "Logged out", data: null });
});

export const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {
    message: "Current user",
    data: authService.me(req.user),
  });
});
