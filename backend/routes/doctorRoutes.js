import express from "express";
import multer from "multer";
import path from "path";
import Appointment from "../models/Appointment.js";
import BedRequest from "../models/BedRequest.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files 'uploads' folder to be saved
  },
  filename: function (req, file, cb) {
    // Unique filename to be generated
    cb(
      null,
      `doctor-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

/* ✅ Doctor first time setup route starts */
router.put(
  "/setup",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
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

      // If file uploaded, update profilePicture path
      if (req.file) {
        doctor.profilePicture = req.file.path.replace(/\\/g, "/");
      }

      await doctor.save();

      // ✅ Filtered response (password & sensitive data excluded)
      res.json({
        msg: "Setup completed successfully",
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
          specialization: doctor.specialization,
          experience: doctor.experience,
          hospital: doctor.hospital,
          profilePicture: doctor.profilePicture || "",
          firstLogin: doctor.firstLogin,
        },
      });
    } catch (err) {
      console.error("Doctor Setup Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);
/* Doctor first time setup route ends */

/*✅ Doctor can see their patients appointments starts*/
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
/* Doctor can see their patients appointments ends*/

/* ✅ Doctor to update their own status starts*/
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

    res.json({
      msg: `Status updated to ${status}`,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        status: doctor.status,
        profilePicture: doctor.profilePicture || "",
      },
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
});
/* Doctor to update their own status ends*/

/* ✅ Doctor updates notes, prescription, status for an appointment starts */
router.put("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const { notes, prescription, status } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ msg: "Appointment not found or you don't have access." });
    }

    if (status === "Completed") {
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
      );
      if (appointmentDateTime > new Date()) {
        return res.status(400).json({
          error:
            "Cannot mark an appointment as completed before its scheduled time.",
        });
      }
    }

    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;
    if (status) appointment.status = status;

    const updatedAppointment = await appointment.save();

    await updatedAppointment.populate("patient", "name email");

    res.json({
      msg: "✅ Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});
/* Doctor updates notes, prescription, status for an appointment ends */

/* ✅ Bed Request related routes starts */
// Doctor requests a bed for a patient
router.post("/request-bed", authMiddleware, async (req, res) => {
  try {
    const { patientId, ward } = req.body;
    const doctorId = req.user.id;

    const newRequest = new BedRequest({
      patient: patientId,
      doctor: doctorId,
      ward: ward,
    });
    await newRequest.save();

    res
      .status(201)
      .json({ msg: "Bed request sent successfully.", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor can see their sent bed requests
router.get("/my-bed-requests", authMiddleware, async (req, res) => {
  try {
    const requests = await BedRequest.find({ doctor: req.user.id }).populate(
      "patient",
      "name"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* Bed Request related routes ends */

export default router;
