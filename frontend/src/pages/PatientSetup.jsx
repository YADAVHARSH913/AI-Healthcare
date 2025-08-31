import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PatientSetup = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    previousProblems: "",
  
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/patient/setup",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Setup completed successfully!");
      setLoading(false);

      navigate("/patient/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "❌ Something went wrong";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Patient First Time Setup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
         
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select BloodGroup</option>
            <option value="male">A+</option>
            <option value="female">B+</option>
            <option value="other">AB+</option>
            <option value="other">A-</option>
            <option value="other">B-</option>
            <option value="other">AB-</option>
            <option value="other">O-</option>
            <option value="other">O+</option>
          </select>

          <textarea
            name="previousproblems"
            placeholder="Is There Any Major Problem Previously?"
            value={formData.previousproblems}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientSetup;
