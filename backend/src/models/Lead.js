import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    source: { type: String, trim: true, default: "inbound" },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
      default: "NEW",
      index: true,
    },
    notes: { type: String, default: "" },
    convertedCandidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
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

leadSchema.index({ companyId: 1, phone: 1 });
leadSchema.index({ name: "text", email: "text" });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
