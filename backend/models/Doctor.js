import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // auth ke user se link
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  hospital: { type: String, required: true },
  fees: { type: Number, required: true },
  availableSlots: [{ day: String, time: String }], // jaise [{day: "Mon", time:"10-2"}]
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Doctor", doctorSchema);
