import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, default: "General"},
  supplier: { type: String }
}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);
