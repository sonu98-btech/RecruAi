import companyService from "../services/company.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCompany = asyncHandler(async (req, res) => {
  const data = await companyService.createBySuperAdmin(req.user, req.body);
  return ApiResponse.created(res, { message: "Company created", data });
});

export const listCompanies = asyncHandler(async (req, res) => {
  const data = await companyService.list(req.user, req.query);
  return ApiResponse.success(res, { message: "Companies fetched", data });
});

export const getCompany = asyncHandler(async (req, res) => {
  const data = await companyService.getById(req.user, req.params.id);
  return ApiResponse.success(res, { message: "Company fetched", data });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const data = await companyService.update(req.user, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Company updated", data });
});
