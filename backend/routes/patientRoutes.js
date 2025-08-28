import express from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Patient first time setup (password + details + problems)
 */
router.put("/setup", authMiddleware, async (req, res) => {
  try {
    const { password, age, gender, problem, symptoms } = req.body;

    const patient = await User.findById(req.user.id);

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ msg: "Patient not found" });
    }

    if (!patient.firstLogin) {
      return res.status(400).json({ msg: "Setup already completed" });
    }

    // ✅ Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      patient.password = hashedPassword;
    }

    // ✅ Save extra details
    patient.age = age;
    patient.gender = gender;
    patient.problem = problem;
    patient.symptoms = symptoms;

    // ✅ Mark first login complete
    patient.firstLogin = false;

    await patient.save();

    res.json({ msg: "✅ Patient setup completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Book appointment
 */
router.post("/appointments", authMiddleware, async (req, res) => {
  try {
    const { doctor, date } = req.body;

    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      date,
    });

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Get patient appointments
 */
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email specialization");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
