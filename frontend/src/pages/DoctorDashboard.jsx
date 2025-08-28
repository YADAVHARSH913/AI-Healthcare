import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeGreeting, getRandomGreeting } from "../utils/greetings";
import BroadcastBanner from '../components/BroadcastBanner';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({ notes: "", prescription: "", status: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setDoctor(storedUser);
      }
      const res = await axios.get("http://localhost:5000/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleStatusChange = async (newStatus) => {
    try {
        const res = await axios.put("http://localhost:5000/api/doctor/status",
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctor(prev => ({ ...prev, status: res.data.doctor.status }));
        toast.success(`✅ Status updated to ${newStatus}`);
    } catch (err) {
        toast.error("❌ Failed to update status.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/doctor/appointments/${selectedAppointment._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAppointments(prev => prev.map(appt => appt._id === selectedAppointment._id ? res.data.appointment : appt));
      setSelectedAppointment(null);
      toast.success("✅ Appointment updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to update appointment.");
    }
  };

  return (
    // ✅ Yahaan par pt-24 (padding-top) add kar diya hai
    <div className="p-6 min-h-screen bg-gray-50 pt-24">
      <BroadcastBanner />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{getTimeGreeting()}, Dr. {doctor?.name || ''}! 👨‍⚕️</h1>
        <p className="text-lg text-gray-600 italic">{getRandomGreeting()}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-3">Your Current Status: 
            <span className="font-bold text-blue-600 ml-2">{doctor?.status || 'Loading...'}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => handleStatusChange("Available")} className="bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600">Set to Available</button>
            <button onClick={() => handleStatusChange("On Leave")} className="bg-yellow-500 text-white py-1 px-3 rounded-md text-sm hover:bg-yellow-600">Set to On Leave</button>
            <button onClick={() => handleStatusChange("In Emergency")} className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600">Set to Emergency</button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-700">Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full">
            <thead>
                <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-600">
                    <th className="p-3">Patient</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{appt.patient?.name}</td>
                  <td className="p-3">{appt.patient?.email}</td>
                  <td className="p-3">{new Date(appt.date).toLocaleDateString()} {appt.time}</td>
                  <td className="p-3 font-semibold">{appt.status || "Scheduled"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setFormData({
                          notes: appt.notes || "",
                          prescription: appt.prescription || "",
                          status: appt.status || "Scheduled",
                        });
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppointment && (
        <div className="p-6 mt-6 border rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Update for {selectedAppointment.patient.name}</h2>
          <form onSubmit={handleUpdateSubmit}>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />
            <textarea
              placeholder="Prescription"
              value={formData.prescription}
              onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save Changes
              </button>
              <button type="button" onClick={() => setSelectedAppointment(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;