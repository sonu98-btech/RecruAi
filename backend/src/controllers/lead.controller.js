import leadService from "../services/lead.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createLead = asyncHandler(async (req, res) => {
  const data = await leadService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Lead created", data });
});

export const listLeads = asyncHandler(async (req, res) => {
  const data = await leadService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Leads fetched", data });
});

export const getLead = asyncHandler(async (req, res) => {
  const data = await leadService.get(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Lead fetched", data });
});

export const updateLead = asyncHandler(async (req, res) => {
  const data = await leadService.update(req.tenant.companyId, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Lead updated", data });
});

export const deleteLead = asyncHandler(async (req, res) => {
  await leadService.remove(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Lead deleted", data: null });
});

export const convertLead = asyncHandler(async (req, res) => {
  const data = await leadService.convertToCandidate(req.user, req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Lead converted to candidate", data });
});
