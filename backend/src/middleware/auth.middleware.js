import env from "../config/env.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const cookieToken = req.cookies?.[env.cookieName];
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    throw ApiError.unauthorized("Authentication required");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("Account is inactive or does not exist");
  }

  req.user = user;
  req.auth = { userId: user.id, role: user.role, companyId: user.companyId };
  next();
});
