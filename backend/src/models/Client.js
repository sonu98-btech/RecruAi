import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    requirements: { type: String, default: "" },
    location: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "PROSPECT"],
      default: "PROSPECT",
      index: true,
    },
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

clientSchema.index({ companyId: 1, companyName: 1 });
clientSchema.index({ companyName: "text", contactPerson: "text", requirements: "text" });

const Client = mongoose.model("Client", clientSchema);
export default Client;
