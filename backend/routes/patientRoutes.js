import express from "express";
import Appointment from "../models/Appointment.js";
import BedRequest from "../models/BedRequest.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Patient first time setup (details + problems)
 */
router.put("/setup", authMiddleware, async (req, res) => {
  try {
    const { age, gender, bloodGroup, previousProblems } = req.body;
    const patient = await User.findById(req.user.id);

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ msg: "Patient not found" });
    }

    if (!patient.firstLogin) {
      return res.status(400).json({ msg: "Setup already completed" });
    }

    // ✅ Save extra details
    patient.age = age;
    patient.gender = gender;
    patient.bloodGroup = bloodGroup;
    patient.previousProblems = previousProblems;


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


// ✅  Patient can see their bed request status
router.get("/my-bed-request", authMiddleware, async (req, res) => {
  try {
    const request = await BedRequest.findOne({ patient: req.user.id })
        .sort({ createdAt: -1 }); // Sabse naya waala
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
