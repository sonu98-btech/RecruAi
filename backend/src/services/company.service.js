import { ROLES, PLAN_CREDITS } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import companyRepository from "../repositories/company.repository.js";

class CompanyService {
  async createBySuperAdmin(actor, payload) {
    if (actor.role !== ROLES.SUPER_ADMIN) {
      throw ApiError.forbidden();
    }
    const exists = await companyRepository.findByEmail(payload.email);
    if (exists) throw ApiError.conflict("Company email already exists");
    const plan = payload.plan || "FREE";
    return companyRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      industry: payload.industry,
      createdBy: actor.id,
      subscription: {
        plan,
        credits: PLAN_CREDITS[plan] ?? PLAN_CREDITS.FREE,
        status: "ACTIVE",
      },
    });
  }

  async list(actor, query) {
    if (actor.role !== ROLES.SUPER_ADMIN) {
      const company = await companyRepository.findById(actor.companyId);
      return { items: company ? [company] : [], pagination: { total: company ? 1 : 0, page: 1, limit: 1, pages: 1 } };
    }
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter["subscription.status"] = query.status;
    const [items, total] = await Promise.all([
      companyRepository.findMany(filter, { skip, limit }),
      companyRepository.count(filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async getById(actor, id) {
    const company = await companyRepository.findById(id);
    if (!company) throw ApiError.notFound("Company not found");
    if (actor.role !== ROLES.SUPER_ADMIN && String(company.id) !== String(actor.companyId)) {
      throw ApiError.forbidden();
    }
    return company;
  }

  async update(actor, id, payload) {
    await this.getById(actor, id);
    if (actor.role !== ROLES.SUPER_ADMIN && actor.role !== ROLES.COMPANY_ADMIN) {
      throw ApiError.forbidden();
    }
    const update = {};
    ["name", "phone", "industry"].forEach((k) => {
      if (payload[k] != null) update[k] = payload[k];
    });
    if (actor.role === ROLES.SUPER_ADMIN && payload.subscription) {
      update.subscription = payload.subscription;
    }
    return companyRepository.updateById(id, update);
  }
}

export default new CompanyService();
