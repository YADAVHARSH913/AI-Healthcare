import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// ================= ADMIN LOGIN =================
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: admin._id, name: admin.name, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= REGISTER (patient by default) =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",  // ✅ default patient
      firstLogin: true          // ✅ first time login required
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        firstLogin: user.firstLogin,
        profilePicture: user.profilePicture || ""
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GENERIC LOGIN (patients + doctors) =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ YEH HAI FIX: Ab hum poora user object bhejenge (bina password ke)
    // This converts the Mongoose document to a plain object and deletes the password.
    // Now it will include ALL fields like 'profilePicture', 'status', etc.
    const userToReturn = user.toObject();
    delete userToReturn.password;

    res.json({
      message: "Login successful",
      token,
      user: userToReturn // Sending the complete user object
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});



// ================= DOCTOR ONLY LOGIN (optional, same as /login but stricter) =================
router.post("/doctor-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await User.findOne({ email, role: "doctor" });
    if (!doctor) return res.status(400).json({ msg: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: doctor._id, role: doctor.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        firstLogin: doctor.firstLogin,   // ✅ setup flag
        specialization: doctor.specialization,
        experience: doctor.experience,
        hospital: doctor.hospital,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter your email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Naya password '123456' set kar aur hash kar
    const newPassword = "123456";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // User ka password update kar aur firstLogin = true set kar
    user.password = hashedPassword;
    user.firstLogin = true; // Taaki agle login par password change karna pade
    await user.save();

    res.json({
      message: "Password has been reset to '123456'. Please login to set a new password."
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});
export default router;
