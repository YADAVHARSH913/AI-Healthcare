import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
   time: { type: String, required: true},
  symptoms: { type: String },
  report: { type: String },
  status: { type: String, default: "pending" },
  notes: { type: String },         // ✅ Doctor notes
  prescription: { type: String },  // ✅ Doctor prescription
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
