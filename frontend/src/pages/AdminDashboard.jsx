import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// --- Icon Components ---
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.817M7 20v-2c0-1.657-1.343-3-3-3H2" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  
  const [doctorForm, setDoctorForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [broadcastForm, setBroadcastForm] = useState({ message: "", audience: "All" });

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/manage/doctors", config),
          axios.get("http://localhost:5000/api/admin/manage/patients", config),
          axios.get("http://localhost:5000/api/admin/manage/appointments", config)
        ]);
        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);
        setStats({
          doctors: doctorsRes.data.length,
          patients: patientsRes.data.length,
          appointments: appointmentsRes.data.length
        });
      } catch (error) {
        toast.error("Failed to load initial data.");
      }
    };
    fetchData();
  }, []);

  const handleDoctorFormChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/manage/doctor", doctorForm, config);
      setDoctors([...doctors, res.data.doctor]);
      toast.success("✅ Doctor Added!");
      setDoctorForm({ name: "", email: "", password: "", specialization: "" });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error adding doctor");
    }
  };
  
  const deleteUser = async (id, role) => {
    if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
        try {
            await axios.delete(`http://localhost:5000/api/admin/manage/user/${id}`, config);
            if (role === 'doctor') {
                setDoctors(doctors.filter(d => d._id !== id));
            } else {
                setPatients(patients.filter(p => p._id !== id));
            }
            toast.success(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} removed!`);
        } catch (err) {
            toast.error(`Error removing ${role}`);
        }
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const res = await axios.put(`http://localhost:5000/api/admin/manage/appointment/${id}/cancel`, {}, config);
        setAppointments(prev => prev.map(appt => appt._id === id ? res.data.appointment : appt));
        toast.success("✅ Appointment Cancelled by Admin!");
      } catch (err) {
        toast.error("Error cancelling appointment");
      }
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/api/admin/broadcast", broadcastForm, config);
        toast.success("📢 Broadcast message sent!");
        setBroadcastForm({ message: "", audience: "All" });
    } catch (err) {
        toast.error("Failed to send broadcast.");
    }
  };

  return (
    // ✅ Yahaan par pt-24 (padding-top) add kar diya hai
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pt-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Doctors</p><p className="text-3xl font-bold text-blue-600">{stats.doctors}</p></div><UserPlusIcon /></div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Patients</p><p className="text-3xl font-bold text-green-600">{stats.patients}</p></div><UsersIcon /></div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Appointments</p><p className="text-3xl font-bold text-indigo-600">{stats.appointments}</p></div><CalendarIcon /></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4">
            <button onClick={() => setActiveTab('doctors')} className={`py-2 px-4 font-semibold ${activeTab === 'doctors' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Doctors</button>
            <button onClick={() => setActiveTab('patients')} className={`py-2 px-4 font-semibold ${activeTab === 'patients' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Patients</button>
            <button onClick={() => setActiveTab('appointments')} className={`py-2 px-4 font-semibold ${activeTab === 'appointments' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Appointments</button>
            <button onClick={() => setActiveTab('broadcast')} className={`py-2 px-4 font-semibold ${activeTab === 'broadcast' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Broadcast</button>
          </nav>
        </div>
        
        {activeTab === 'doctors' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Add a New Doctor</h3>
            <form onSubmit={addDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <input type="text" name="name" value={doctorForm.name} onChange={handleDoctorFormChange} placeholder="Doctor Name" className="p-2 border rounded-md" required />
              <input type="email" name="email" value={doctorForm.email} onChange={handleDoctorFormChange} placeholder="Doctor Email" className="p-2 border rounded-md" required />
              <input type="password" name="password" value={doctorForm.password} onChange={handleDoctorFormChange} placeholder="Temporary Password" className="p-2 border rounded-md" required />
              <input type="text" name="specialization" value={doctorForm.specialization} onChange={handleDoctorFormChange} placeholder="Specialization" className="p-2 border rounded-md" />
              <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Doctor</button>
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-100"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Specialization</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc._id} className="border-b">
                      <td className="p-3">{doc.name}</td><td className="p-3">{doc.email}</td><td className="p-3">{doc.specialization}</td>
                      <td className="p-3"><button onClick={() => deleteUser(doc._id, 'doctor')} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="bg-gray-100"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p._id} className="border-b">
                      <td className="p-3">{p.name}</td><td className="p-3">{p.email}</td>
                      <td className="p-3"><button onClick={() => deleteUser(p._id, 'patient')} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-100"><th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Date & Time</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt._id} className="border-b">
                    <td className="p-3">{appt.patient?.name}</td><td className="p-3">{appt.doctor?.name}</td><td className="p-3">{new Date(appt.date).toLocaleDateString()} {appt.time}</td><td className="p-3">{appt.status}</td>
                    <td className="p-3">{appt.status !== "Cancelled" && (<button onClick={() => cancelAppointment(appt._id)} className="text-red-500 hover:text-red-700"><CancelIcon /></button>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'broadcast' && (
            <div>
                <h3 className="text-xl font-semibold mb-4">Send a New Broadcast Message</h3>
                <form onSubmit={handleBroadcastSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <textarea value={broadcastForm.message} onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})} placeholder="Enter your message here..." className="w-full p-2 border rounded-md" required/>
                    <select value={broadcastForm.audience} onChange={(e) => setBroadcastForm({...broadcastForm, audience: e.target.value})} className="w-full p-2 border rounded-md">
                        <option value="All">All Users</option><option value="Doctors">Doctors Only</option><option value="Patients">Patients Only</option>
                    </select>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Send Broadcast</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;