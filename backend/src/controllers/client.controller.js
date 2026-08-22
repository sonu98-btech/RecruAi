import clientService from "../services/client.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createClient = asyncHandler(async (req, res) => {
  const data = await clientService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Client created", data });
});

export const listClients = asyncHandler(async (req, res) => {
  const data = await clientService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Clients fetched", data });
});

export const getClient = asyncHandler(async (req, res) => {
  const data = await clientService.get(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Client fetched", data });
});

export const updateClient = asyncHandler(async (req, res) => {
  const data = await clientService.update(req.tenant.companyId, req.params.id, req.body);
  return ApiResponse.success(res, { message: "Client updated", data });
});

export const deleteClient = asyncHandler(async (req, res) => {
  await clientService.remove(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Client deleted", data: null });
});
