import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../api/auth";
import axios from "axios"; // Axios ko direct use karenge reset ke liye

import loginBg from '../assets/login-bg.jpg';

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal ke liye state
  const [resetEmail, setResetEmail] = useState(""); // Reset email ke liye state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // ... (Login waala handleSubmit function same rahega) ...
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      const user = res.data.user || res.data.doctor;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      toast.success("✅ Login successful!");
      setTimeout(() => {
        if (user.role === "doctor") {
          navigate(user.firstLogin ? "/doctor/setup" : "/doctor/dashboard");
        } else if (user.role === "patient") {
          navigate(user.firstLogin ? "/patient/setup" : "/patient/dashboard");
        }
      }, 1000);
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Password reset handle karne ka function
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      return toast.error("Please enter your email.");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: resetEmail });
      toast.success(res.data.message);
      setIsModalOpen(false); // Modal band kar do
      setResetEmail(""); // Email field saaf kar do
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex w-full max-w-4xl h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="hidden md:block w-1/2 h-full">
            <img src={loginBg} alt="Healthcare Professionals" className="w-full h-full object-cover"/>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome Back!</h2>
            <p className="text-gray-600 mb-8 text-center">Login to access your dashboard.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" autoComplete="off"  placeholder="firstname@medicare.com" onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              
              {/* ✅ Forgot Password Link */}
              <div className="text-right text-sm">
                <button type="button" onClick={() => setIsModalOpen(true)} className="font-medium text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Forgot Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-6">Enter your email and we'll reset your password to a temporary one.</p>
            <form onSubmit={handlePasswordReset}>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm" 
                placeholder="Enter your registered email"
                required 
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;