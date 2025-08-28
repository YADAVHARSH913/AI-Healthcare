import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  audience: { type: String, enum: ["All", "Doctors", "Patients"], default: "All" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Broadcast", broadcastSchema);