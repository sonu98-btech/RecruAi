import callRepository from "../repositories/call.repository.js";
import companyRepository from "../repositories/company.repository.js";
import candidateService from "./candidate.service.js";
import notificationService from "./notification.service.js";
import { voiceAiPipeline } from "./ai/pipeline.js";
import { twilioAdapter } from "./telephony/twilio.adapter.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";
import {
  CALL_STATUS,
  CALL_TYPE,
  NOTIFICATION_TYPES,
} from "../utils/constants.js";
import { emitToCompany } from "../sockets/index.js";

class CallService {
  async create(actor, companyId, payload) {
    const candidate = await candidateService.get(companyId, payload.candidateId);

    const billed = await companyRepository.consumeCredit(companyId, 1);
    if (!billed) {
      throw ApiError.forbidden("Insufficient calling credits for this company");
    }

    const telephony = await twilioAdapter.placeOutboundCall({
      to: candidate.phone,
      from: payload.from,
      webhookUrl: "/api/calls/webhooks/twilio/voice",
      statusCallback: "/api/calls/webhooks/twilio/status",
    });

    const call = await callRepository.create({
      candidateId: candidate.id,
      agentId: payload.agentId || actor.id,
      campaignId: payload.campaignId,
      callType: payload.callType || CALL_TYPE.OUTBOUND,
      duration: payload.duration || 0,
      recordingUrl: payload.recordingUrl || "",
      transcript: payload.transcript || "",
      callStatus: payload.callStatus || CALL_STATUS.INITIATED,
      notes: payload.notes || "",
      telephony: {
        provider: telephony.provider,
        providerCallSid: telephony.sid,
        from: payload.from,
        to: candidate.phone,
      },
      creditsConsumed: 1,
      companyId,
    });

    emitToCompany(companyId, "call:created", { callId: call.id, candidateId: candidate.id });
    await notificationService.notifyCompanyAdmins({
      companyId,
      message: `Call logged for ${candidate.name}`,
      type: NOTIFICATION_TYPES.CALL_UPDATED,
      metadata: { callId: call.id },
    });

    return call;
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.callStatus) filter.callStatus = query.callStatus;
    if (query.callType) filter.callType = query.callType;
    if (query.candidateId) filter.candidateId = query.candidateId;
    if (query.agentId) filter.agentId = query.agentId;
    const [items, total] = await Promise.all([
      callRepository.findMany(companyId, filter, {
        skip,
        limit,
        populate: "candidateId agentId",
      }),
      callRepository.count(companyId, filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async get(companyId, id) {
    assertValidObjectId(id);
    const call = await callRepository.findById(companyId, id, "candidateId agentId campaignId");
    if (!call) throw ApiError.notFound("Call not found");
    return call;
  }

  async applyTwilioStatus(body) {
    const sid = body.CallSid;
    if (!sid) throw ApiError.badRequest("CallSid required");
    const call = await callRepository.findByProviderSid(sid);
    if (!call) throw ApiError.notFound("Call not found for provider SID");

    const map = {
      ringing: CALL_STATUS.RINGING,
      "in-progress": CALL_STATUS.CONNECTED,
      completed: CALL_STATUS.COMPLETED,
      busy: CALL_STATUS.MISSED,
      "no-answer": CALL_STATUS.MISSED,
      failed: CALL_STATUS.FAILED,
      canceled: CALL_STATUS.FAILED,
    };
    const next = map[String(body.CallStatus || "").toLowerCase()];
    const update = {};
    if (next) update.callStatus = next;
    if (body.CallDuration) update.duration = Number(body.CallDuration);
    if (body.RecordingUrl) update.recordingUrl = body.RecordingUrl;

    const updated = await callRepository.updateById(call.companyId, call.id, update);
    emitToCompany(call.companyId, "call:updated", { callId: call.id, callStatus: updated.callStatus });
    return updated;
  }

  async analyzeAndPersist(companyId, callId, transcript) {
    const call = await this.get(companyId, callId);
    const { analysis, decision } = await voiceAiPipeline.fromTranscript(transcript);
    const updated = await callRepository.updateById(companyId, call.id, {
      transcript,
      aiAnalysis: analysis,
    });
    return { call: updated, analysis, decision };
  }

  async applyTwilioRecording(body) {
    const sid = body.CallSid;
    const recordingUrl = body.RecordingUrl;
    if (!sid) throw ApiError.badRequest("CallSid required");
    const call = await callRepository.findByProviderSid(sid);
    if (!call) throw ApiError.notFound("Call not found for provider SID");

    const updated = await callRepository.updateById(call.companyId, call.id, {
      recordingUrl,
      callStatus: CALL_STATUS.COMPLETED
    });

    // Run AI pipeline asynchronously
    const simulatedTranscript = "Hello, my name is John. I have 4 years of experience as a developer and I build frontend applications using React and CSS.";
    this.analyzeAndPersist(call.companyId, call.id, simulatedTranscript).catch(err => {
      console.error("Failed to run AI pipeline", err);
    });

    emitToCompany(call.companyId, "call:updated", { callId: call.id, callStatus: updated.callStatus });
    return updated;
  }
}

export default new CallService();
