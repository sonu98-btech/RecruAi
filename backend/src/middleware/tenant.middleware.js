import mongoose from "mongoose";
import { ROLES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Tenant isolation:
 * - Company users are always scoped to their own companyId.
 * - SUPER_ADMIN may pass X-Company-Id to operate on a tenant.
 * Repositories must use req.tenant.companyId for all business queries.
 */
export function tenantIsolation(req, _res, next) {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  if (req.user.role === ROLES.SUPER_ADMIN) {
    const headerCompanyId = req.header("x-company-id") || req.query.companyId;
    if (headerCompanyId && !mongoose.Types.ObjectId.isValid(headerCompanyId)) {
      return next(ApiError.badRequest("Invalid company scope"));
    }
    req.tenant = {
      companyId: headerCompanyId || null,
      isSuperAdmin: true,
    };
    return next();
  }

  if (!req.user.companyId) {
    return next(ApiError.forbidden("User is not assigned to a company"));
  }

  req.tenant = {
    companyId: req.user.companyId,
    isSuperAdmin: false,
  };

  next();
}

export function requireTenant(req, _res, next) {
  if (!req.tenant?.companyId) {
    return next(
      ApiError.badRequest("Company context required. Super admins must send X-Company-Id."),
    );
  }
  next();
}
