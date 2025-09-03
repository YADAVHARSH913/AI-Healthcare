import express from "express";
import User from "../models/User.js";
import Bed from "../models/Bed.js";
import BedRequest from "../models/BedRequest.js";
import Appointment from "../models/Appointment.js";
import Broadcast from "../models/Broadcast.js";
import Medicine from "../models/Medicine.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Middleware: only admin access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

// ================= USER MANAGEMENT (Doctors & Patients) =================

// ✅ Add a doctor (Admin only)
router.post("/manage/doctor", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, specialization, experience, hospital } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialization,
      experience,
      hospital,
      firstLogin: true
    });

    await doctor.save();
    res.json({ msg: "Doctor added successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all doctors (for admin panel)
router.get("/manage/doctors", authMiddleware, adminOnly, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅  Fetch all patients (for admin panel)
router.get("/manage/patients", authMiddleware, adminOnly, async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅  Remove any user (doctor or patient)
router.delete("/manage/user/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= APPOINTMENT MANAGEMENT  =================

// ✅  Get all appointments for all users
router.get("/manage/appointments", authMiddleware, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("doctor", "name")
      .populate("patient", "name")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin can cancel any appointment
router.put("/manage/appointment/:id/cancel", authMiddleware, adminOnly, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ msg: "Appointment not found." });
    res.json({ msg: "Appointment cancelled by admin.", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= BROADCAST MANAGEMENT (UPDATED SECTION) =================

// ✅ GET all broadcast messages (for admin history view)
router.get("/broadcasts", authMiddleware, adminOnly, async (req, res) => {
  try {
    const broadcasts = await Broadcast.find({}).sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new broadcast message
router.post("/broadcast", authMiddleware, adminOnly, async (req, res) => {
  try {
    // Make all other active messages inactive before sending a new one
    await Broadcast.updateMany({ isActive: true }, { isActive: false });

    const { message, audience } = req.body;
    const newBroadcast = new Broadcast({ message, audience, isActive: true });
    await newBroadcast.save();
    res.status(201).json({ msg: "Broadcast message sent!", broadcast: newBroadcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT (update) an existing broadcast message
router.put("/broadcast/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { message, audience } = req.body;
    const updatedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { message, audience },
      { new: true }
    );
    if (!updatedBroadcast) return res.status(404).json({ msg: "Broadcast not found." });
    res.json({ msg: "Broadcast updated successfully", broadcast: updatedBroadcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a broadcast message
router.delete("/broadcast/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedBroadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!deletedBroadcast) return res.status(404).json({ msg: "Broadcast not found." });
    res.json({ msg: "Broadcast message cancelled." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ================= BED REQUEST MANAGEMENT (Request send by doctor to admin for patients)  =================

// ✅  Get all bed requests
router.get("/bed-requests", authMiddleware, adminOnly, async (req, res) => {
  try {
    const requests = await BedRequest.find()
      .populate("patient", "name")
      .populate("doctor", "name")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅  Accept or Reject a bed request
router.put("/bed-requests/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const request = await BedRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: "Request not found." });
    }

    if (status === "Accepted") {
      // Bed accept hone par, uss ward ka available count -1 kar do
      await Bed.updateOne({ ward: request.ward }, { $inc: { available: -1 } });
    }

    request.status = status;
    if (status === "Rejected") {
      request.rejectionReason = rejectionReason;
    }
    await request.save();

    res.json({ msg: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Discharge a patient from a bed
router.put("/discharge-patient/:requestId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const request = await BedRequest.findById(req.params.requestId);
    if (!request || request.status !== "Accepted") {
      return res.status(404).json({ msg: "Accepted bed request not found." });
    }

    // Step 1: Make the bed available again
    await Bed.updateOne({ ward: request.ward }, { $inc: { available: 1 } });

    // Step 2: Delete the bed request from the system
    await BedRequest.findByIdAndDelete(req.params.requestId);

    res.json({ msg: "Patient discharged successfully and bed is now available." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================= BEDS MANAGEMENT (Data showing in admin portal) =================
router.post("/beds", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { ward, total, available } = req.body;

    // Check if ward already exists
    const existingWard = await Bed.findOne({ ward: ward });
    if (existingWard) {
      return res.status(400).json({ error: "Ward with this name already exists." });
    }
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
    if (!bed) return res.status(404).json({ error: "Ward not found." });
    res.json({ msg: "Bed info updated", bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅  Delete a bed/ward
router.delete("/beds/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Bed.findByIdAndDelete(req.params.id);
    res.json({ msg: "Bed info deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================= MEDICINE MANAGEMENT =================

// ✅ GET all medicines (for admin panel)
router.get("/medicines", authMiddleware, adminOnly, async (req, res) => {
    try {
        const medicines = await Medicine.find({}).sort({ name: 1 }); // Sort alphabetically
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST a new medicine
router.post("/medicine", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, stock, category, supplier } = req.body;
        const newMedicine = new Medicine({ name, stock, category, supplier });
        await newMedicine.save();
        res.status(201).json({ msg: "Medicine added successfully", medicine: newMedicine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT (update) an existing medicine's stock
router.put("/medicine/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, stock, category, supplier } = req.body;
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { name, stock, category, supplier },
            { new: true }
        );
        if (!updatedMedicine) return res.status(404).json({ msg: "Medicine not found." });
        res.json({ msg: "Medicine updated successfully", medicine: updatedMedicine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE a medicine
router.delete("/medicine/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!deletedMedicine) return res.status(404).json({ msg: "Medicine not found." });
        res.json({ msg: "Medicine removed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;