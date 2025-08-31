import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  ward: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    type: Number,
    required: true
  },
  available: {
    type: Number,
    required: true
  },
}, { timestamps: true }); 

export default mongoose.model("Bed", bedSchema);