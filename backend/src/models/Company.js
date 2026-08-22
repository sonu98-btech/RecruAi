import mongoose from "mongoose";
import { PLAN_CREDITS, SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS } from "../utils/constants.js";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    industry: { type: String, trim: true, default: "Recruitment" },
    subscription: {
      plan: {
        type: String,
        enum: Object.values(SUBSCRIPTION_PLANS),
        default: SUBSCRIPTION_PLANS.FREE,
      },
      credits: { type: Number, default: PLAN_CREDITS.FREE, min: 0 },
      status: {
        type: String,
        enum: Object.values(SUBSCRIPTION_STATUS),
        default: SUBSCRIPTION_STATUS.TRIAL,
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ name: 1 });

const Company = mongoose.model("Company", companySchema);
export default Company;
