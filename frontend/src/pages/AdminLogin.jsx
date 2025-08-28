import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// Asset folder se image import kar
import adminBg from '../assets/admin-bg.jpg';

function AdminLogin() {
  // ✅ Yahaan par default email set kar diya hai
  const [formData, setFormData] = useState({ email: "admin@medicare.com", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", formData);
      
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        toast.error("❌ Access Denied. Only for Admins.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));
      toast.success("✅ Admin Login successful!");

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* --- Image Section --- */}
        <div className="hidden md:block w-1/2 h-full">
          <img 
            src={adminBg} 
            alt="Hospital Administration" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- Form Section --- */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Admin Portal</h2>
          <p className="text-gray-600 mb-8 text-center">Login to manage the hospital system.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email} // ✅ Value ko state se joda
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100" // Thoda alag look diya
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Not an admin? Go back to{" "}
            <Link to="/" className="font-medium text-indigo-600 hover:underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;