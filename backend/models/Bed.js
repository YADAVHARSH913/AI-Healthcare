import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  icuBeds: { type: Number, default: 0 },
  generalBeds: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bed", bedSchema);
