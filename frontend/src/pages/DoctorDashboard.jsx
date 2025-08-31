import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeGreeting, getRandomGreeting } from "../utils/greetings";
import BroadcastBanner from '../components/BroadcastBanner';

const DoctorDashboard = () => {
  // --- STATE MANAGEMENT ---
  // This section holds all the dynamic data for the component.

  const [doctor, setDoctor] = useState(null); // Stores the logged-in doctor's information.
  const [appointments, setAppointments] = useState([]); // Stores the list of appointments for this doctor.
  const [beds, setBeds] = useState([]); // Stores the list of all available wards and their bed counts.
  const [bedRequests, setBedRequests] = useState([]); // Stores the bed requests previously made by this doctor.
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Tracks which appointment is selected for an action (update or bed request).
  const [isBedModalOpen, setIsBedModalOpen] = useState(false); // Controls the visibility of the bed request modal.
  const [selectedWard, setSelectedWard] = useState(""); // Stores the selected ward from the bed request form.
  const [formData, setFormData] = useState({ notes: "", prescription: "", status: "" }); // Holds data for the appointment update form.
  const [loading, setLoading] = useState(true); // Manages the loading state for data fetching.

  // --- CONFIGURATION ---
  // Reusable configuration for Axios requests, including the authorization token.

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };


  // --- DATA FETCHING ---
  // This useEffect hook fetches all necessary data from the backend when the component first loads.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setDoctor(storedUser);
        
        // Fetches appointments, bed list, and previous bed requests all at once for efficiency.
        const [appointmentsRes, bedsRes, bedRequestsRes] = await Promise.all([
            axios.get("http://localhost:5000/api/doctor/appointments", config),
            axios.get("http://localhost:5000/api/beds"), // Public route, no config needed
            axios.get("http://localhost:5000/api/doctor/my-bed-requests", config)
        ]);

        setAppointments(appointmentsRes.data);
        setBeds(bedsRes.data);
        setBedRequests(bedRequestsRes.data);
      } catch (err) {
        toast.error("❌ Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);


  // --- HANDLER FUNCTIONS ---
  // These functions handle all user interactions on the page.

  // Updates the doctor's own availability status (e.g., Available, On Leave).
  const handleStatusChange = async (newStatus) => {
    try {
        const res = await axios.put("http://localhost:5000/api/doctor/status", { status: newStatus }, config);
        setDoctor(prev => ({ ...prev, status: res.data.doctor.status }));
        toast.success(`✅ Status updated to ${newStatus}`);
    } catch (err) {
        toast.error("❌ Failed to update status.");
    }
  };

  // Submits the form to update an appointment's notes, prescription, and status.
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/doctor/appointments/${selectedAppointment._id}`, formData, config);
      setAppointments(prev => prev.map(appt => appt._id === selectedAppointment._id ? res.data.appointment : appt));
      setSelectedAppointment(null); // Close the update form
      toast.success("✅ Appointment updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to update appointment.");
    }
  };

  // Submits the form to request a bed for a patient.
  const handleBedRequestSubmit = async (e) => {
      e.preventDefault();
      if (!selectedWard) {
          return toast.error("Please select a ward.");
      }
      try {
          const payload = {
              patientId: selectedAppointment.patient._id,
              ward: selectedWard
          };
          const res = await axios.post("http://localhost:5000/api/doctor/request-bed", payload, config);
          setBedRequests([...bedRequests, res.data.request]); // Add the new request to the list
          toast.success("✅ Bed request sent to admin!");
          setIsBedModalOpen(false);
          setSelectedAppointment(null);
          setSelectedWard("");
      } catch (err) {
          toast.error(err.response?.data?.error || "Failed to send request.");
      }
  };

  // Helper function to check if a bed request already exists for a patient.
  const getBedRequestStatusForPatient = (patientId) => {
      const request = bedRequests.find(req => req.patient._id === patientId);
      return request ? request.status : null;
  };


  // --- JSX RENDER ---
  // This is the final HTML structure of the component.
  return (
    <div className="p-6 min-h-screen bg-gray-50 pt-24">
      <BroadcastBanner />
      
      {/* Header and Doctor Status Section */}
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

      {/* Appointments Table */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Your Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase">
                <th className="p-3">Patient</th><th className="p-3">Email</th><th className="p-3">Date & Time</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const bedRequestStatus = getBedRequestStatusForPatient(appt.patient._id);
                return (
                  <tr key={appt._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{appt.patient?.name}</td>
                    <td className="p-3">{appt.patient?.email}</td>
                    <td className="p-3">{new Date(appt.date).toLocaleDateString()} {appt.time}</td>
                    <td className="p-3 font-semibold">{appt.status || "Scheduled"}</td>
                    <td className="p-3 flex flex-wrap gap-2">
                      <button onClick={() => { setSelectedAppointment(appt); setFormData({ notes: appt.notes || "", prescription: appt.prescription || "", status: appt.status || "Scheduled"}); }} className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">Update</button>
                      
                      {/* Conditionally render Bed Request button or Status Badge */}
                      {bedRequestStatus ? (
                          <span className={`px-3 py-1 text-sm rounded-md font-semibold text-white ${
                              bedRequestStatus === 'Accepted' ? 'bg-green-500' :
                              bedRequestStatus === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                              Bed: {bedRequestStatus}
                          </span>
                      ) : (
                          <button onClick={() => { setSelectedAppointment(appt); setIsBedModalOpen(true); }} className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">Request Bed</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Appointment Form (shown as a section below the table) */}
      {selectedAppointment && !isBedModalOpen && (
        <div className="p-6 mt-6 border rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Update for {selectedAppointment.patient.name}</h2>
          <form onSubmit={handleUpdateSubmit}>
            <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded mb-3"/>
            <textarea placeholder="Prescription" value={formData.prescription} onChange={(e) => setFormData({ ...formData, prescription: e.target.value })} className="w-full p-2 border rounded mb-3"/>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded mb-4">
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
              <button type="button" onClick={() => setSelectedAppointment(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Bed Request Modal */}
      {isBedModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Request Bed for {selectedAppointment.patient.name}</h2>
            <form onSubmit={handleBedRequestSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Ward</label>
              <select 
                value={selectedWard} 
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">-- Available Wards --</option>
                {beds.filter(b => b.available > 0).map(ward => (
                    <option key={ward._id} value={ward.ward}>{ward.ward} ({ward.available} available)</option>
                ))}
              </select>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => {setIsBedModalOpen(false); setSelectedAppointment(null);}} className="bg-gray-300 py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;