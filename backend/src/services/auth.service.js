import { ROLES, PLAN_CREDITS, SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { signAccessToken } from "../utils/jwt.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import userRepository from "../repositories/user.repository.js";
import companyRepository from "../repositories/company.repository.js";
import auditRepository from "../repositories/audit.repository.js";

function tokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    companyId: user.companyId,
  };
}

class AuthService {
  async registerCompany({ companyName, industry, name, email, password, phone }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict("Email is already registered");
    }

    const existingCompany = await companyRepository.findByEmail(email);
    if (existingCompany) {
      throw ApiError.conflict("A company with this email already exists");
    }

    const company = await companyRepository.create({
      name: companyName,
      email,
      phone,
      industry: industry || "Recruitment",
      subscription: {
        plan: SUBSCRIPTION_PLANS.FREE,
        credits: PLAN_CREDITS.FREE,
        status: SUBSCRIPTION_STATUS.TRIAL,
      },
    });

    const admin = await userRepository.create({
      name,
      email,
      password,
      phone,
      role: ROLES.COMPANY_ADMIN,
      companyId: company.id,
    });

    await companyRepository.updateById(company.id, { createdBy: admin.id });
    await auditRepository.record({
      companyId: company.id,
      actorId: admin.id,
      action: "COMPANY_REGISTERED",
      entity: "Company",
      entityId: company.id,
    });

    const token = signAccessToken(tokenPayload(admin));
    return { user: admin.toSafeObject(), company, token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, { withPassword: true });
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      throw ApiError.unauthorized("Invalid credentials");
    }
    if (!user.isActive) {
      throw ApiError.forbidden("Account is deactivated");
    }
    const token = signAccessToken(tokenPayload(user));
    return { user: user.toSafeObject(), token };
  }

  me(user) {
    return user.toSafeObject();
  }

  async createMember(actor, companyId, { name, email, password, phone, role }) {
    if (![ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN].includes(actor.role)) {
      throw ApiError.forbidden("Only company admins can invite users");
    }
    if (role === ROLES.SUPER_ADMIN && actor.role !== ROLES.SUPER_ADMIN) {
      throw ApiError.forbidden("Cannot create a super admin");
    }
    if (!companyId) {
      throw ApiError.badRequest("Company context required");
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict("Email is already registered");
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      phone,
      role: role || ROLES.RECRUITER,
      companyId,
    });

    await auditRepository.record({
      companyId,
      actorId: actor.id,
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
    });

    return user.toSafeObject();
  }

  async listMembers(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.isActive != null) filter.isActive = query.isActive === "true";
    const [items, total] = await Promise.all([
      userRepository.findCompanyMembers(companyId, filter, { skip, limit }),
      userRepository.countCompanyMembers(companyId, filter),
    ]);
    return paginatedResult({
      items: items.map((u) => u.toSafeObject()),
      total,
      page,
      limit,
    });
  }

  async updateMember(actor, targetId, payload) {
    const target = await userRepository.findById(targetId);
    if (!target) throw ApiError.notFound("User not found");
    if (actor.role !== ROLES.SUPER_ADMIN && String(target.companyId) !== String(actor.companyId)) {
      throw ApiError.forbidden("Cannot modify users outside your company");
    }
    if (payload.role === ROLES.SUPER_ADMIN && actor.role !== ROLES.SUPER_ADMIN) {
      throw ApiError.forbidden("Cannot assign super admin");
    }
    const allowed = {};
    if (payload.name) allowed.name = payload.name;
    if (payload.phone) allowed.phone = payload.phone;
    if (payload.role) allowed.role = payload.role;
    if (typeof payload.isActive === "boolean") allowed.isActive = payload.isActive;
    const updated = await userRepository.updateById(targetId, allowed);
    return updated.toSafeObject();
  }
}

export default new AuthService();
