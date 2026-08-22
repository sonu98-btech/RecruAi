import campaignRepository from "../repositories/campaign.repository.js";
import callService from "./call.service.js";
import notificationService from "./notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import { CAMPAIGN_STATUS, NOTIFICATION_TYPES } from "../utils/constants.js";

class CampaignService {
  async create(actor, companyId, payload) {
    return campaignRepository.create({
      name: payload.name,
      description: payload.description || "",
      candidates: payload.candidates || [],
      script: payload.script || "",
      status: CAMPAIGN_STATUS.DRAFT,
      stats: { queued: (payload.candidates || []).length, connected: 0, missed: 0, failed: 0 },
      createdBy: actor.id,
      companyId,
    });
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      campaignRepository.findMany(companyId, filter, { skip, limit }),
      campaignRepository.count(companyId, filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async get(companyId, id) {
    assertValidObjectId(id);
    const campaign = await campaignRepository.findById(companyId, id, "candidates createdBy");
    if (!campaign) throw ApiError.notFound("Campaign not found");
    return campaign;
  }

  async update(companyId, id, payload) {
    await this.get(companyId, id);
    const update = { ...payload };
    delete update.companyId;
    delete update.createdBy;
    return campaignRepository.updateById(companyId, id, update);
  }

  async start(actor, companyId, id) {
    const campaign = await this.get(companyId, id);
    if (campaign.status === CAMPAIGN_STATUS.COMPLETED) {
      throw ApiError.badRequest("Completed campaigns cannot be restarted");
    }

    const updated = await campaignRepository.updateById(companyId, id, {
      status: CAMPAIGN_STATUS.ACTIVE,
      startedAt: new Date(),
      "stats.queued": campaign.candidates.length,
    });

    const calls = [];
    for (const candidateId of campaign.candidates) {
      try {
        const call = await callService.create(actor, companyId, {
          candidateId,
          campaignId: campaign.id,
          callType: "OUTBOUND",
        });
        calls.push(call);
      } catch {
        // Credit exhaustion or missing candidate should not abort the whole campaign.
      }
    }

    await notificationService.notifyCompanyAdmins({
      companyId,
      message: `Campaign started: ${campaign.name}`,
      type: NOTIFICATION_TYPES.CAMPAIGN_UPDATED,
      metadata: { campaignId: campaign.id, queuedCalls: calls.length },
    });

    return { campaign: updated, queuedCalls: calls.length };
  }

  async pause(companyId, id) {
    await this.get(companyId, id);
    return campaignRepository.updateById(companyId, id, { $set: { status: CAMPAIGN_STATUS.PAUSED } });
  }
}

export default new CampaignService();
