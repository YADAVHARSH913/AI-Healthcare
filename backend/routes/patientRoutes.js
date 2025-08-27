import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// book appointment
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

// get patient appointments
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
