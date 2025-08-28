import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorSetup = () => {
  const [formData, setFormData] = useState({
    password: "",
    specialization: "",
    experience: "",
    hospital: "",
  });
  const [profilePicture, setProfilePicture] = useState(null); // ✅ Photo ke liye state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // ✅ File ko state mein save kar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Saari details FormData mein daal
    data.append('password', formData.password);
    data.append('specialization', formData.specialization);
    data.append('experience', formData.experience);
    data.append('hospital', formData.hospital);
    
    if (profilePicture) {
      data.append('profilePicture', profilePicture); // ✅ Photo bhi daal
    }

    try {
      await axios.put(
        "http://localhost:5000/api/doctor/setup",
        data, // ✅ FormData object bhej
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" // ✅ Ye header zaroori hai
          },
        }
      );

      toast.success("✅ Setup completed successfully!");
      navigate("/doctor/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "❌ Something went wrong";
      toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Doctor First-Time Setup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ✅ Profile Picture Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="New Password (min. 6 characters)"
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (in years)"
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            name="hospital"
            placeholder="Hospital Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSetup;