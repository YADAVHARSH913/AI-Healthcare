// routes/adminDoctor.js
import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Middleware: only admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied. Admins only." });
  next();
};

// ✅ Admin create doctor
router.post("/doctor", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, specialization, experience, hospital } = req.body;

    // Temporary password
    const tempPassword = "Doc@" + Math.floor(1000 + Math.random() * 9000);

    const doctor = new User({
      name,
      email,
      password: tempPassword,
      role: "doctor",
      mustChangePassword: true, // 🔹 force reset on first login
    });

    await doctor.save();
    res.json({
      msg: "Doctor created successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization,
        tempPassword,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
