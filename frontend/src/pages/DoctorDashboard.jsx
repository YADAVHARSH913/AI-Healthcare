import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTimeGreeting, getRandomGreeting } from "../utils/greetings";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({ notes: "", prescription: "", status: "Pending" });
  const [loading, setLoading] = useState(true);
  const [timeGreeting, setTimeGreeting] = useState("");
  const [randomGreeting, setRandomGreeting] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch appointments of doctor
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("❌ Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    setTimeGreeting(getTimeGreeting());      // Time-based greeting
    setRandomGreeting(getRandomGreeting());  // Random greeting
  }, []);

  // 🔹 Update appointment
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/doctor/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Appointment updated successfully", { autoClose: 2000 });
        setSelectedAppointment(null);
        fetchAppointments();
      } else {
        toast.error(data.msg || "❌ Error updating appointment");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error("❌ Server error");
    }
  };

  return (
    <div className="p-6">
      {/* Greeting Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{timeGreeting}</h1>
        <p className="text-lg text-gray-600 italic">{randomGreeting}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table className="w-full border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border">
                <td className="p-2 border">{appt.patient?.name}</td>
                <td className="p-2 border">{appt.patient?.email}</td>
                <td className="p-2 border">
                  {new Date(appt.date).toLocaleDateString()}{" "}
                  {new Date(appt.date).toLocaleTimeString()}
                </td>
                <td className="p-2 border">{appt.status || "Pending"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appt._id);
                      setFormData({
                        notes: appt.notes || "",
                        prescription: appt.prescription || "",
                        status: appt.status || "Pending",
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Update Form */}
      {selectedAppointment && (
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Update Appointment</h2>

          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />

          <textarea
            placeholder="Prescription"
            value={formData.prescription}
            onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />

          {/* 🔹 Dropdown for status */}
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => handleUpdate(selectedAppointment)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setSelectedAppointment(null)}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
