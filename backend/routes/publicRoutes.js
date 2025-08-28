import express from "express";
import User from "../models/User.js";
import Broadcast from "../models/Broadcast.js";

const router = express.Router();

// ✅ Route to get all doctors (for patients and public)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Get the latest active broadcast message
router.get("/broadcast/latest", async (req, res) => {
    try {
        const latestBroadcast = await Broadcast.findOne({ isActive: true });
        res.json(latestBroadcast);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;