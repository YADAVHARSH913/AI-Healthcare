import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Book Appointment (Patient)
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date
    });

    await newAppointment.save();
    res.status(201).json({ msg: "Appointment booked successfully", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Patient's Appointments
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate("doctor", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Patient can cancel an appointment
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ msg: "Access denied. Patients only." });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    res.json({ msg: "Appointment cancelled", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Patient can update appointment date/time
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ msg: "Access denied. Patients only." });
    }

    const { date } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id },
      { date, status: "pending" }, // status reset to pending
      { new: true }
    );

    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    res.json({ msg: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
