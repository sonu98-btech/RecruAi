import leadRepository from "../repositories/lead.repository.js";
import candidateService from "./candidate.service.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId, escapeRegex } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";

class LeadService {
  async create(actor, companyId, payload) {
    return leadRepository.create({
      ...payload,
      companyId,
      createdBy: actor.id,
    });
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;
    if (query.search) {
      const rx = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }
    const [items, total] = await Promise.all([
      leadRepository.findMany(companyId, filter, { skip, limit }),
      leadRepository.count(companyId, filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async get(companyId, id) {
    assertValidObjectId(id);
    const lead = await leadRepository.findById(companyId, id);
    if (!lead) throw ApiError.notFound("Lead not found");
    return lead;
  }

  async update(companyId, id, payload) {
    await this.get(companyId, id);
    const update = { ...payload };
    delete update.companyId;
    return leadRepository.updateById(companyId, id, update);
  }

  async remove(companyId, id) {
    await this.get(companyId, id);
    return leadRepository.deleteById(companyId, id);
  }

  async convertToCandidate(actor, companyId, id) {
    const lead = await this.get(companyId, id);
    const candidate = await candidateService.create(actor, companyId, {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source || "lead",
    });
    await leadRepository.updateById(companyId, id, {
      status: "CONVERTED",
      convertedCandidateId: candidate.id,
    });
    return { lead, candidate };
  }
}

export default new LeadService();
