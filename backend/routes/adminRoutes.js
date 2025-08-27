import express from "express";
import User from "../models/User.js";
import Bed from "../models/Bed.js";
import Medicine from "../models/Medicine.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware: only admin access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

// ✅ Add a doctor
router.post("/doctor", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const doctor = new User({ name, email, password, role: "doctor" });
    await doctor.save();
    res.json({ msg: "Doctor added", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove a doctor
router.delete("/doctor/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Doctor removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Manage Beds
router.post("/beds", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { ward, total, available } = req.body;
    const bed = new Bed({ ward, total, available });
    await bed.save();
    res.json({ msg: "Bed info added", bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/beds/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Bed info updated", bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Manage Medicines
router.post("/medicine", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, stock } = req.body;
    const medicine = new Medicine({ name, stock });
    await medicine.save();
    res.json({ msg: "Medicine added", medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/medicine/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Medicine updated", medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
