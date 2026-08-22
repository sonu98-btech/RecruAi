import mongoose from "mongoose";
import { FOLLOWUP_STATUS } from "../utils/constants.js";

const followupSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    task: { type: String, required: true, trim: true },
    reminderDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(FOLLOWUP_STATUS),
      default: FOLLOWUP_STATUS.PENDING,
      index: true,
    },
    reminderSentAt: { type: Date },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

followupSchema.index({ companyId: 1, status: 1, reminderDate: 1 });

const Followup = mongoose.model("Followup", followupSchema);
export default Followup;
