import mongoose from "mongoose";
import { CANDIDATE_STATUS } from "../utils/constants.js";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: Object.values(CANDIDATE_STATUS), required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    skills: [{ type: String, trim: true }],
    experience: { type: Number, min: 0, default: 0 },
    resumeUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(CANDIDATE_STATUS),
      default: CANDIDATE_STATUS.NEW,
      index: true,
    },
    source: { type: String, trim: true, default: "manual" },
    notes: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statusHistory: [statusHistorySchema],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

candidateSchema.index({ companyId: 1, email: 1 });
candidateSchema.index({ companyId: 1, phone: 1 });
candidateSchema.index({ companyId: 1, createdAt: -1 });
candidateSchema.index({
  name: "text",
  email: "text",
  skills: "text",
  notes: "text",
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
