import followupRepository from "../repositories/followup.repository.js";
import candidateService from "./candidate.service.js";
import notificationService from "./notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import { FOLLOWUP_STATUS, NOTIFICATION_TYPES } from "../utils/constants.js";

class FollowupService {
  async create(actor, companyId, payload) {
    await candidateService.get(companyId, payload.candidateId);
    return followupRepository.create({
      candidateId: payload.candidateId,
      assignedTo: payload.assignedTo,
      task: payload.task,
      reminderDate: new Date(payload.reminderDate),
      status: FOLLOWUP_STATUS.PENDING,
      companyId,
      createdBy: actor.id,
    });
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;
    if (query.candidateId) filter.candidateId = query.candidateId;
    const [items, total] = await Promise.all([
      followupRepository.findMany(companyId, filter, {
        skip,
        limit,
        populate: "candidateId assignedTo",
      }),
      followupRepository.count(companyId, filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async update(companyId, id, payload) {
    assertValidObjectId(id);
    const existing = await followupRepository.findById(companyId, id);
    if (!existing) throw ApiError.notFound("Follow-up not found");
    const update = {};
    if (payload.task) update.task = payload.task;
    if (payload.reminderDate) update.reminderDate = new Date(payload.reminderDate);
    if (payload.status) update.status = payload.status;
    if (payload.assignedTo) update.assignedTo = payload.assignedTo;
    return followupRepository.updateById(companyId, id, update);
  }

  async dispatchDueReminders() {
    const due = await followupRepository.dueReminders();
    for (const item of due) {
      await notificationService.notifyUsers({
        userIds: [item.assignedTo],
        companyId: item.companyId,
        message: `Follow-up due: ${item.task}`,
        type: NOTIFICATION_TYPES.FOLLOWUP_REMINDER,
        metadata: { followupId: item.id, candidateId: item.candidateId },
      });
      await followupRepository.updateById(item.companyId, item.id, { reminderSentAt: new Date() });
    }
    return due.length;
  }
}

export default new FollowupService();
