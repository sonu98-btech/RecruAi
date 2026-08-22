import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

export function assertValidObjectId(id, label = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${label}`);
  }
}

export function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
