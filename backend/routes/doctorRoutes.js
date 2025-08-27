import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Doctor can see their patients' appointments
 */
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name email");

    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Server error while fetching appointments" });
  }
});

/**
 * ✅ Doctor updates notes, prescription, status for an appointment
 */
router.put("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const { notes, prescription, status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user.id },
      { 
        ...(notes && { notes }),
        ...(prescription && { prescription }),
        ...(status && { status })
      },
      { new: true }
    ).populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json({ msg: "✅ Appointment updated successfully", appointment });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

export default router;
