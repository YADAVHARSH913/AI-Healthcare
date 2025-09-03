import { Routes, Route } from "react-router-dom";
// --- Basic Import ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

// --- Components Routes Import ---
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// --- Nav & Foot Import ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- Doctor pages Import ---
import DoctorSetup from "./pages/DoctorSetup";
import DoctorDashboard from "./pages/DoctorDashboard";

// --- Patient Pages Import ---
import PatientSetup from "./pages/PatientSetup";
import PatientDashboard from "./pages/PatientDashboard";

// --- Admin Pages Import ---
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// --- Bed & Inventory Pages Import ---
import BedAvailability from "./pages/BedAvailability";


// --- Toast Import (for Notification pop up)---
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Main App Function ---
function App() {
  return (
    <>
      <Navbar />

      {/* Notifications for login & other all pop up's */}
      <ToastContainer position="top-right" autoClose={1000} /> 

      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

        {/* --- Protected Routes (Only for logged-in users) --- */}
        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/doctor/setup" element={<ProtectedRoute><DoctorSetup /></ProtectedRoute>} />
        <Route path="/patient/setup" element={<ProtectedRoute><PatientSetup /></ProtectedRoute>} />

        {/* --- Bed & Inventory Management (Admin only) --- */}
        <Route path="/beds" element={<BedAvailability />} />

        {/* --- Static Pages for details --- */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
  
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;