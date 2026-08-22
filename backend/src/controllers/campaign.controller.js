import campaignService from "../services/campaign.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCampaign = asyncHandler(async (req, res) => {
  const data = await campaignService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Campaign created", data });
});

export const listCampaigns = asyncHandler(async (req, res) => {
  const data = await campaignService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Campaigns fetched", data });
});

export const getCampaign = asyncHandler(async (req, res) => {
  const data = await campaignService.get(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Campaign fetched", data });
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const data = await campaignService.update(req.tenant.companyId, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Campaign updated", data });
});

export const startCampaign = asyncHandler(async (req, res) => {
  const data = await campaignService.start(req.user, req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Campaign started", data });
});

export const pauseCampaign = asyncHandler(async (req, res) => {
  const data = await campaignService.pause(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Campaign paused", data });
});
