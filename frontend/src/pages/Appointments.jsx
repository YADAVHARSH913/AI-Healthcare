import { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Backend ka base URL
  const API_URL = "http://localhost:5000/api/patient";

  // 🔹 Token localStorage se uthao
  const token = localStorage.getItem("token");

  // ✅ Get appointments of logged in patient
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Book new appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/appointments`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Appointment booked successfully!");
      setFormData({ doctor: "", date: "", time: "" });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to book appointment");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📅 Book an Appointment</h2>

      {/* Appointment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-4 rounded mb-6"
      >
        <input
          type="text"
          name="doctor"
          placeholder="Doctor ID"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-3 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-3 rounded"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Book Appointment
        </button>
      </form>

      {message && <p className="mb-4 text-center">{message}</p>}

      {/* Appointment List */}
      <h3 className="text-xl font-semibold mb-2">Your Appointments</h3>
      <ul className="space-y-3">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <li
              key={appt._id}
              className="border p-3 rounded shadow-sm bg-gray-50"
            >
              <p>
                <strong>Doctor:</strong> {appt.doctor?.name || appt.doctor}
              </p>
              <p>
                <strong>Date:</strong> {appt.date?.slice(0, 10)} |{" "}
                <strong>Time:</strong> {appt.time}
              </p>
              {appt.notes && <p>📝 Notes: {appt.notes}</p>}
              {appt.prescription && (
                <p>💊 Prescription: {appt.prescription}</p>
              )}
            </li>
          ))
        ) : (
          <p>No appointments yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Appointments;
