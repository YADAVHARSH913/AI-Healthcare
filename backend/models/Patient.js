import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  medicalHistory: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);
