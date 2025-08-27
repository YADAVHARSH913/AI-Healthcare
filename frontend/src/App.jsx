import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />

      {/* ✅ ToastContainer Routes ke bahar hi rahega */}
      <ToastContainer position="top-right" autoClose={1000} />

      <Routes>
        {/* ✅ Default route "/" redirect karega Home par */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* ✅ Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
