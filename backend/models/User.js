import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  
  // --- Doctor Specific Fields ---
  specialization: { type: String },
  experience: { type: Number },
  hospital: { type: String },
  firstLogin: { type: Boolean, default: true },
   profilePicture: { type: String },
  // ✅ Naya Status Field (Sirf Doctor ke liye)
  status: {
    type: String,
    enum: ["Available", "On Leave", "In Emergency"],
    default: "Available"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);

