import aiService from "../services/ai.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analyzeCall = asyncHandler(async (req, res) => {
  const data = await aiService.analyzeTranscript(req.body.transcript);
  return ApiResponse.success(res, { message: "Call analyzed", data });
});

export const analyzeStoredCall = asyncHandler(async (req, res) => {
  const transcript = req.body.transcript;
  const data = await aiService.analyzeCallRecord(
    req.tenant.companyId,
    req.params.id,
    transcript,
  );
  return ApiResponse.success(res, { message: "Call analyzed and saved", data });
});
