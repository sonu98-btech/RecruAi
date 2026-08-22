import candidateService from "../services/candidate.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCandidate = asyncHandler(async (req, res) => {
  const data = await candidateService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Candidate created", data });
});

export const listCandidates = asyncHandler(async (req, res) => {
  const data = await candidateService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Candidates fetched", data });
});

export const getCandidate = asyncHandler(async (req, res) => {
  const data = await candidateService.get(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Candidate fetched", data });
});

export const updateCandidate = asyncHandler(async (req, res) => {
  const data = await candidateService.update(req.user, req.tenant.companyId, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Candidate updated", data });
});

export const deleteCandidate = asyncHandler(async (req, res) => {
  await candidateService.remove(req.user, req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Candidate deleted", data: null });
});

export const uploadResume = asyncHandler(async (req, res) => {
  const relativeUrl = `/uploads/${req.file.filename}`;
  const data = await candidateService.attachResume(req.tenant.companyId, req.params.id, relativeUrl);
  return ApiResponse.success(res, { message: "Resume uploaded", data });
});
