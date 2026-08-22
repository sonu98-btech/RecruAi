import mongoose from "mongoose";
import { CAMPAIGN_STATUS } from "../utils/constants.js";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    status: {
      type: String,
      enum: Object.values(CAMPAIGN_STATUS),
      default: CAMPAIGN_STATUS.DRAFT,
      index: true,
    },
    script: { type: String, default: "" },
    startedAt: Date,
    completedAt: Date,
    stats: {
      queued: { type: Number, default: 0 },
      connected: { type: Number, default: 0 },
      missed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

campaignSchema.index({ companyId: 1, createdAt: -1 });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
