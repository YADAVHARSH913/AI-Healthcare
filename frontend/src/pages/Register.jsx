import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/auth";

// Asset folder se image import kar
import registerBg from '../assets/register-bg.jpg';

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser({ ...formData, role: 'patient' });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("storage"));
      toast.success("✅ Registration successful!");

      setTimeout(() => {
        navigate("/patient/setup");
      }, 1000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* --- Form Section --- */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Create Your Account</h2>
          <p className="text-gray-600 mb-8 text-center">Join us to manage your health better.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* --- Image Section --- */}
        <div className="hidden md:block w-1/2 h-full">
          <img 
            src={registerBg} 
            alt="Patient Registration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;