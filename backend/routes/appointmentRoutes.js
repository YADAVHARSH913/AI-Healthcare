import express from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

const APPOINTMENT_LIMIT_PER_HOUR = 5; // Ek ghante mein 5 appointments

// ✅ Book a New Appointment (POST /api/appointments)
router.post("/", authMiddleware, upload.single('report'), async (req, res) => {
  try {
    const { doctor, date, time, symptoms } = req.body;
    const patientId = req.user.id;

    // --- Validation Rules ---

    // 1. Check if doctor is available
    const doctorDetails = await User.findById(doctor);
    if (!doctorDetails || doctorDetails.status !== "Available") {
      return res.status(400).json({ error: "Doctor is currently unavailable." });
    }

    // 2. Check if date is in the past
    const selectedDate = new Date(`${date}T${time}`);
    if (selectedDate < new Date()) {
      return res.status(400).json({ error: "You cannot book an appointment in the past." });
    }

    // 3. Check if time is between 9 AM and 9 PM
    const appointmentHour = parseInt(time.split(":")[0]);
    if (appointmentHour < 9 || appointmentHour >= 21) {
      return res.status(400).json({ error: "Appointments are only available from 9:00 AM to 9:00 PM." });
    }

    // 4. Check if the time slot is full for the doctor
    const existingAppointments = await Appointment.countDocuments({
      doctor: doctor,
      date: date,
      time: time
    });

    if (existingAppointments >= APPOINTMENT_LIMIT_PER_HOUR) {
      return res.status(400).json({ error: "This time slot is full. Please choose another time." });
    }

    // --- End of Validation ---

    const newAppointment = new Appointment({
      patient: patientId,
      doctor,
      date,
      time,
      symptoms,
      status: "Scheduled",
      report: req.file ? req.file.path : null, // File upload handle karna hai toh iska setup karna padega
    });

    await newAppointment.save();
    const populatedAppointment = await Appointment.findById(newAppointment._id).populate("doctor", "name specialization");
    res.status(201).json({ msg: "Appointment booked successfully", appointment: populatedAppointment });

  } catch (err) {
    console.log("APPOINTMENT BOOKING ERROR:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ✅ Get all appointments for the logged-in patient (GET /api/patient/appointments)
// Note: This route should be in patientRoutes.js to be consistent
// But keeping it here as per your file structure for now.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Patient can cancel an appointment (PUT /api/appointments/:id/cancel)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id }, // Security check: only the patient can cancel
      { status: "Cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found or you don't have access." });
    }

    res.json({ msg: "Appointment cancelled successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
