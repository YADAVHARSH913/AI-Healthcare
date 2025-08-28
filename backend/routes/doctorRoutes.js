import express from "express";
import multer from "multer"; // ✅ Multer import kiya
import path from "path";   // ✅ Path import kiya
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files 'uploads' folder mein save hongi
  },
  filename: function (req, file, cb) {
    // Unique filename banao taaki files overwrite na hon
    cb(null, `doctor-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// ✅ Doctor first time setup - ab photo bhi lega
router.put("/setup", authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const { password, specialization, experience, hospital } = req.body;
    const doctor = await User.findById(req.user.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    if (!doctor.firstLogin) {
      return res.status(400).json({ msg: "Setup already completed" });
    }

    // Update details
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        doctor.password = hashedPassword;
    }
    doctor.specialization = specialization;
    doctor.experience = experience;
    doctor.hospital = hospital;
    doctor.firstLogin = false;

    // ✅ Agar file upload hui hai, toh uska path save kar
    if (req.file) {
      doctor.profilePicture = req.file.path;
    }

    await doctor.save();
    res.json({ msg: "Setup completed successfully", doctor });
  } catch (err) {
    console.error("Doctor Setup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Baaki ke routes waise hi rahenge ---

/**
 * ✅ Doctor can see their patients' appointments
 */
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name email")
      .sort({ date: -1 }); // Naye appointments upar

    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Server error while fetching appointments" });
  }
});


/**
 * ✅ Doctor to update their own status
 */
router.put("/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied." });
    }
    const { status } = req.body;
    if (!["Available", "On Leave", "In Emergency"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value." });
    }

    const doctor = await User.findById(req.user.id);
    doctor.status = status;
    await doctor.save();

    res.json({ msg: `Status updated to ${status}`, doctor });

  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error while updating status" });
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

    const appointment = await Appointment.findOne({ 
        _id: req.params.id, 
        doctor: req.user.id 
    });

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found or you don't have access." });
    }

    if (status === "Completed") {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      if (appointmentDateTime > new Date()) {
        return res.status(400).json({ error: "Cannot mark an appointment as completed before its scheduled time." });
      }
    }

    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;
    if (status) appointment.status = status;

    const updatedAppointment = await appointment.save();
    
    await updatedAppointment.populate("patient", "name email");

    res.json({ msg: "✅ Appointment updated successfully", appointment: updatedAppointment });
    
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

export default router;