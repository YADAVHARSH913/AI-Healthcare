// models/BedRequest.js
import mongoose from "mongoose";

const bedRequestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ward: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  rejectionReason: { type: String },
}, { timestamps: true });

export default mongoose.model("BedRequest", bedRequestSchema);