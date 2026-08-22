import dashboardService from "../services/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const overview = asyncHandler(async (req, res) => {
  const data = await dashboardService.overview(req.tenant.companyId);
  return ApiResponse.success(res, { message: "Dashboard overview", data });
});
