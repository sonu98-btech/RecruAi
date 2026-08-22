import candidateRepository from "../repositories/candidate.repository.js";
import auditRepository from "../repositories/audit.repository.js";
import notificationService from "./notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId, escapeRegex } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import { CANDIDATE_STATUS, NOTIFICATION_TYPES } from "../utils/constants.js";

class CandidateService {
  buildFilter(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;
    if (query.minExperience) filter.experience = { $gte: Number(query.minExperience) };
    if (query.skill) filter.skills = { $in: [new RegExp(`^${escapeRegex(query.skill)}$`, "i")] };
    if (query.search) {
      const rx = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { skills: rx }];
    }
    return filter;
  }

  async create(actor, companyId, payload) {
    const candidate = await candidateRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      skills: payload.skills || [],
      experience: payload.experience || 0,
      resumeUrl: payload.resumeUrl || "",
      status: payload.status || CANDIDATE_STATUS.NEW,
      source: payload.source || "manual",
      notes: payload.notes || "",
      assignedTo: payload.assignedTo,
      statusHistory: [
        {
          status: payload.status || CANDIDATE_STATUS.NEW,
          changedBy: actor.id,
          note: "Created",
        },
      ],
      companyId,
      createdBy: actor.id,
    });

    await auditRepository.record({
      companyId,
      actorId: actor.id,
      action: "CANDIDATE_CREATED",
      entity: "Candidate",
      entityId: candidate.id,
    });

    await notificationService.notifyCompanyAdmins({
      companyId,
      message: `New candidate added: ${candidate.name}`,
      type: NOTIFICATION_TYPES.CANDIDATE_CREATED,
      metadata: { candidateId: candidate.id },
    });

    return candidate;
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = this.buildFilter(query);
    const { items, total } = await candidateRepository.search(companyId, { filter, skip, limit });
    return paginatedResult({ items, total, page, limit });
  }

  async get(companyId, id) {
    assertValidObjectId(id);
    const candidate = await candidateRepository.findById(companyId, id, "assignedTo createdBy");
    if (!candidate) throw ApiError.notFound("Candidate not found");
    return candidate;
  }

  async update(actor, companyId, id, payload) {
    const existing = await this.get(companyId, id);
    const set = { ...payload };
    delete set.companyId;
    delete set.createdBy;
    delete set.statusHistory;
    delete set.statusNote;

    const mongoUpdate = { $set: set };
    if (payload.status && payload.status !== existing.status) {
      mongoUpdate.$push = {
        statusHistory: {
          status: payload.status,
          changedBy: actor.id,
          note: payload.statusNote || "",
        },
      };
    }

    const updated = await candidateRepository.updateById(companyId, id, mongoUpdate);
    await auditRepository.record({
      companyId,
      actorId: actor.id,
      action: "CANDIDATE_UPDATED",
      entity: "Candidate",
      entityId: id,
    });
    return updated;
  }

  async remove(actor, companyId, id) {
    await this.get(companyId, id);
    await candidateRepository.deleteById(companyId, id);
    await auditRepository.record({
      companyId,
      actorId: actor.id,
      action: "CANDIDATE_DELETED",
      entity: "Candidate",
      entityId: id,
    });
  }

  async attachResume(companyId, id, relativeUrl) {
    await this.get(companyId, id);
    return candidateRepository.updateById(companyId, id, { $set: { resumeUrl: relativeUrl } });
  }
}

export default new CandidateService();
