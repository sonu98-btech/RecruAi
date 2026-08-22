import mongoose from "mongoose";
import { CALL_STATUS, CALL_TYPE } from "../utils/constants.js";

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: { type: String, default: "" },
    sentiment: { type: String, default: "" },
    candidateScore: { type: Number, min: 0, max: 100 },
    recommendation: { type: String, default: "" },
    analyzedAt: { type: Date },
    provider: { type: String, default: "demo" },
  },
  { _id: false },
);

const callSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    callType: {
      type: String,
      enum: Object.values(CALL_TYPE),
      default: CALL_TYPE.OUTBOUND,
    },
    duration: { type: Number, default: 0, min: 0 },
    recordingUrl: { type: String, default: "" },
    transcript: { type: String, default: "" },
    callStatus: {
      type: String,
      enum: Object.values(CALL_STATUS),
      default: CALL_STATUS.INITIATED,
      index: true,
    },
    telephony: {
      provider: { type: String, default: "manual" },
      providerCallSid: { type: String, index: true },
      from: String,
      to: String,
    },
    aiAnalysis: { type: aiAnalysisSchema, default: () => ({}) },
    notes: { type: String, default: "" },
    creditsConsumed: { type: Number, default: 0 },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

callSchema.index({ companyId: 1, createdAt: -1 });
callSchema.index({ companyId: 1, agentId: 1, createdAt: -1 });

const Call = mongoose.model("Call", callSchema);
export default Call;
