import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js";


// Routes import
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import publicRoutes from "./routes/publicRoutes.js"; 
import bedRoutes from "./routes/bedRoutes.js";
import adminAuth from "./routes/adminAuth.js";
import adminDoctor from "./routes/adminDoctor.js";

dotenv.config();

// ✅ Step 1: Initialize app
const app = express();

// ✅ Step 2: Middlewares
app.use(cors());
app.use(express.json());

// ✅ Step 3: Routes
app.use('/uploads', express.static('uploads')); 
app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/admin/auth", adminAuth);     
app.use("/api/admin/manage", adminDoctor);


// ✅ Step 4: Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


  // Default Admin Create Function
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        name: "Super Admin",
        email: "admin@medicare.com",
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Default Admin Created: admin@medicare.com / admin123");
    }
  } catch (error) {
    console.log("Error creating default admin:", error.message);
  }
};




// ✅ Step 5: Connect MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(async() => {
    console.log("✅ MongoDB Connected");
    await createDefaultAdmin();   
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
