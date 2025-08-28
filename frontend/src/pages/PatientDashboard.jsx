import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeGreeting } from "../utils/greetings";
import BroadcastBanner from '../components/BroadcastBanner';

// --- Icon Components ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4 mr-2 inline text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "", date: "", time: "", symptoms: "", report: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/patient/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/doctors", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data.filter(doc => doc.status === 'Available'));
      } catch (err) {
        toast.error("Could not load your data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      const res = await axios.post("http://localhost:5000/api/appointments", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setAppointments([res.data.appointment, ...appointments]);
      toast.success("✅ Appointment booked successfully!");
      setIsModalOpen(false);
      setFormData({ doctor: "", date: "", time: "", symptoms: "", report: null });
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to book appointment");
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i < 21; i++) slots.push(`${String(i).padStart(2, '0')}:00`);
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const getStatusBadge = (status) => {
    const statuses = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return statuses[status] || 'bg-gray-100 text-gray-800';
  };

  // ✅ Time ko format karne ka function
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        <BroadcastBanner />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getTimeGreeting()}, {user?.name || "Patient"}! 👋
        </h1>
        <p className="text-gray-500 mb-8">Welcome to your health dashboard.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Your Appointments</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                >
                    <PlusCircleIcon />
                    <span>Book New</span>
                </button>
            </div>
            
            {loading ? <p>Loading...</p> : appointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                <img src="https://placehold.co/128x128/e0f2fe/0c4a6e.png?text=🗓️" alt="No Appointments" className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No appointments yet</h3>
                <p className="text-gray-500 mb-4">Let's book your first one!</p>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Book Appointment</button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div key={appt._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Dr. {appt.doctor?.name}</h3>
                        <p className="text-sm text-blue-600 font-semibold">{appt.doctor?.specialization || 'General'}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(appt.status || 'Scheduled')}`}>{appt.status || 'Scheduled'}</span>
                    </div>
                    <div className="border-t my-3 border-gray-200"></div>
                    <div className="flex items-center text-sm text-gray-700 mb-3">
                      <CalendarIcon /> {new Date(appt.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {/* ✅ Yahaan par naya function use kiya hai */}
                      <ClockIcon /> {formatTime(appt.time)}
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"><span className="font-semibold text-gray-800">Symptoms:</span> {appt.symptoms}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Profile</h2>
                {user && (
                    <div className="flex items-center space-x-4">
                        <UserCircleIcon />
                        <div>
                            <p className="font-bold text-lg text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Links</h2>
                <ul className="space-y-3">
                    <li><a href="#" className="text-blue-600 hover:underline">View Medical History</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Find a Doctor</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">View Lab Reports</a></li>
                </ul>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="doctor" value={formData.doctor} onChange={handleChange} className="w-full border-gray-300 rounded-lg" required>
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doc) => <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>)}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className="w-full border-gray-300 rounded-lg" required />
                <select name="time" value={formData.time} onChange={handleChange} className="w-full border-gray-300 rounded-lg" required>
                  <option value="">-- Select Time Slot --</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{formatTime(slot)}</option>)}
                </select>
              </div>
              <textarea name="symptoms" placeholder="Describe symptoms" value={formData.symptoms} onChange={handleChange} className="w-full border-gray-300 rounded-lg" rows="3" required></textarea>
              <input type="file" name="report" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 hover:file:bg-blue-100" />
              <div className="flex justify-end space-x-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;