import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// --- Icon Components ---
// These are simple SVG components for icons used throughout the dashboard for a clean UI.
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.817M7 20v-2c0-1.657-1.343-3-3-3H2" /></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  // All state variables for the component are declared here.

  const token = localStorage.getItem("token");
  
  // Data States to hold information from the backend
  const [stats, setStats] = useState({ doctors: 0, patients: 0, beds: 0 });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bedRequests, setBedRequests] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  
  // UI State to manage the active tab and editing modes
  const [activeTab, setActiveTab] = useState('bedRequests');
  const [editingBed, setEditingBed] = useState(null);
  const [editingBroadcast, setEditingBroadcast] = useState(null);
  
  // Form States to handle input fields for various forms
  const [doctorForm, setDoctorForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [bedForm, setBedForm] = useState({ ward: "", total: "", available: "" });
  const [broadcastForm, setBroadcastForm] = useState({ message: "", audience: "All" });

  // Axios configuration with authorization header
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  
  // --- DATA FETCHING ---
  // This useEffect hook runs once when the component mounts to fetch all necessary data.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, bedsRes, appointmentsRes, bedRequestsRes, broadcastsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/manage/doctors", config),
          axios.get("http://localhost:5000/api/admin/manage/patients", config),
          axios.get("http://localhost:5000/api/beds", config),
          axios.get("http://localhost:5000/api/admin/manage/appointments", config),
          axios.get("http://localhost:5000/api/admin/bed-requests", config),
          axios.get("http://localhost:5000/api/admin/broadcasts", config)
        ]);

        const bedsData = bedsRes.data || [];
        setDoctors(doctorsRes.data || []);
        setPatients(patientsRes.data || []);
        setBeds(bedsData);
        setAppointments(appointmentsRes.data || []);
        setBedRequests(bedRequestsRes.data || []);
        setBroadcasts(broadcastsRes.data || []);
        
        const availableBeds = bedsData.length > 0 ? bedsData.reduce((acc, ward) => acc + (ward.available || 0), 0) : 0;
        setStats({
          doctors: (doctorsRes.data || []).length,
          patients: (patientsRes.data || []).length,
          beds: availableBeds
        });
      } catch (error) {
        toast.error("Failed to load initial dashboard data.");
      }
    };
    fetchData();
  }, []); // The empty dependency array ensures this runs only once on mount.

  
  // --- HANDLER FUNCTIONS ---
  // All functions that handle user interactions (form changes, submissions, deletions) go here.

  // Doctor Form Handlers
  const handleDoctorFormChange = (e) => setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
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
  
  // Generic User Deletion
  const deleteUser = async (id, role) => {
    if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
        try {
            await axios.delete(`http://localhost:5000/api/admin/manage/user/${id}`, config);
            if (role === 'doctor') setDoctors(doctors.filter(d => d._id !== id));
            else setPatients(patients.filter(p => p._id !== id));
            toast.success(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} removed!`);
        } catch (err) {
            toast.error(`Error removing ${role}`);
        }
    }
  };

  // Bed Management Handlers
  const handleBedFormChange = (e) => setBedForm({ ...bedForm, [e.target.name]: e.target.value });
  const handleEditFormChange = (e) => setEditingBed({ ...editingBed, [e.target.name]: e.target.value });
  
  const addBed = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:5000/api/admin/beds", bedForm, config);
        setBeds([...beds, res.data.bed]);
        toast.success("✅ Bed Info Added!");
        setBedForm({ ward: "", total: "", available: "" });
    } catch (err) {
        toast.error(err.response?.data?.error || "Error adding bed info");
    }
  };

  const deleteBed = async (id) => {
    if (window.confirm("Are you sure you want to delete this ward?")) {
        try {
            await axios.delete(`http://localhost:5000/api/admin/beds/${id}`, config);
            setBeds(beds.filter(b => b._id !== id));
            toast.success("✅ Ward Deleted!");
        } catch (err) {
            toast.error("Error deleting ward.");
        }
    }
  };
  
  const updateBed = async () => {
    try {
        const { _id, ward, total, available } = editingBed;
        const res = await axios.put(`http://localhost:5000/api/admin/beds/${_id}`, { ward, total, available }, config);
        setBeds(beds.map(b => (b._id === _id ? res.data.bed : b)));
        toast.success("✅ Bed Info Updated!");
        setEditingBed(null);
    } catch (err) {
        toast.error("Error updating bed info.");
    }
  };

  // Bed Request Handler
  const handleRequestStatus = async (id, status) => {
      let rejectionReason = "";
      if (status === "Rejected") {
          rejectionReason = window.prompt("Please provide a reason for rejection:");
          if (rejectionReason === null) return; // User cancelled the prompt
      }
      try {
          const payload = { status, rejectionReason };
          const res = await axios.put(`http://localhost:5000/api/admin/bed-requests/${id}`, payload, config);
          setBedRequests(prev => prev.map(req => req._id === id ? res.data.request : req));
          toast.success(`✅ Request has been ${status.toLowerCase()}!`);
      } catch (err) {
          toast.error("Failed to update request status.");
      }
  };

  // Broadcast Handlers
  const handleBroadcastFormChange = (e) => {
      const { name, value } = e.target;
      if (editingBroadcast) setEditingBroadcast({ ...editingBroadcast, [name]: value });
      else setBroadcastForm({ ...broadcastForm, [name]: value });
  };
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (editingBroadcast) {
        try {
            const { _id, message, audience } = editingBroadcast;
            const res = await axios.put(`http://localhost:5000/api/admin/broadcast/${_id}`, { message, audience }, config);
            setBroadcasts(broadcasts.map(b => (b._id === _id ? res.data.broadcast : b)));
            toast.success("📢 Broadcast updated!");
            setEditingBroadcast(null);
        } catch (err) { toast.error("Failed to update broadcast."); }
    } else {
        try {
            const res = await axios.post("http://localhost:5000/api/admin/broadcast", broadcastForm, config);
            setBroadcasts([res.data.broadcast, ...broadcasts]);
            toast.success("📢 Broadcast message sent!");
            setBroadcastForm({ message: "", audience: "All" });
        } catch (err) { toast.error("Failed to send broadcast."); }
    }
  };
  const cancelBroadcast = async (id) => {
      if (window.confirm("Are you sure you want to cancel this broadcast?")) {
          try {
              await axios.delete(`http://localhost:5000/api/admin/broadcast/${id}`, config);
              setBroadcasts(broadcasts.filter(b => b._id !== id));
              toast.success("✅ Broadcast cancelled!");
          } catch (err) { toast.error("Error cancelling broadcast."); }
      }
  };


  // --- JSX RENDER ---
  // The final output of the component.
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pt-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Doctors</p><p className="text-3xl font-bold text-blue-600">{stats.doctors}</p></div><UserPlusIcon /></div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Patients</p><p className="text-3xl font-bold text-green-600">{stats.patients}</p></div><UsersIcon /></div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"><div><p className="text-sm text-gray-500">Available Beds</p><p className="text-3xl font-bold text-red-600">{stats.beds}</p></div><BedIcon /></div>
      </div>

      {/* Main Management Area with Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex flex-wrap -mb-px">
            <button onClick={() => setActiveTab('bedRequests')} className={`py-2 px-4 font-semibold ${activeTab === 'bedRequests' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Bed Requests</button>
            <button onClick={() => setActiveTab('doctors')} className={`py-2 px-4 font-semibold ${activeTab === 'doctors' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Manage Doctors</button>
            <button onClick={() => setActiveTab('patients')} className={`py-2 px-4 font-semibold ${activeTab === 'patients' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Manage Patients</button>
            <button onClick={() => setActiveTab('beds')} className={`py-2 px-4 font-semibold ${activeTab === 'beds' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Manage Beds</button>
            <button onClick={() => setActiveTab('appointments')} className={`py-2 px-4 font-semibold ${activeTab === 'appointments' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>All Appointments</button>
            <button onClick={() => setActiveTab('broadcast')} className={`py-2 px-4 font-semibold ${activeTab === 'broadcast' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Broadcast</button>
          </nav>
        </div>
        
        {/* All Tab Contents */}

        {activeTab === 'bedRequests' && (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Pending Bed Admission Requests</h3>
                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Patient</th><th className="p-3">Requested by Dr.</th><th className="p-3">Ward</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{bedRequests.map(req => (<tr key={req._id} className="border-b hover:bg-gray-50"><td className="p-3 font-semibold">{req.patient?.name}</td><td className="p-3">{req.doctor?.name}</td><td className="p-3">{req.ward}</td><td className="p-3">{req.status}</td><td className="p-3">{req.status === 'Pending' ? (<div className="flex gap-2"><button onClick={() => handleRequestStatus(req._id, 'Accepted')} className="text-green-500 hover:text-green-700"><CheckCircleIcon /></button><button onClick={() => handleRequestStatus(req._id, 'Rejected')} className="text-red-500 hover:text-red-700"><XCircleIcon /></button></div>) : (<span className="text-gray-400">Handled</span>)}</td></tr>))}</tbody></table></div>
            </div>
        )}

        {activeTab === 'doctors' && (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Add a New Doctor</h3>
                <form onSubmit={addDoctor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <input type="text" name="name" value={doctorForm.name} onChange={handleDoctorFormChange} placeholder="Doctor Name" className="p-2 border rounded-md" required />
                    <input type="email" name="email" value={doctorForm.email} onChange={handleDoctorFormChange} placeholder="Doctor Email" className="p-2 border rounded-md" required />
                    <input type="password" name="password" value={doctorForm.password} onChange={handleDoctorFormChange} placeholder="Temporary Password" className="p-2 border rounded-md" required />
                    <input type="text" name="specialization" value={doctorForm.specialization} onChange={handleDoctorFormChange} placeholder="Specialization" className="p-2 border rounded-md" />
                    <button type="submit" className="lg:col-span-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Doctor</button>
                </form>
                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Specialization</th><th className="p-3">Actions</th></tr></thead><tbody>{doctors.map(doc => (<tr key={doc._id} className="border-b hover:bg-gray-50"><td className="p-3">{doc.name}</td><td className="p-3">{doc.email}</td><td className="p-3">{doc.specialization}</td><td className="p-3"><button onClick={() => deleteUser(doc._id, 'doctor')} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td></tr>))}</tbody></table></div>
            </div>
        )}

        {activeTab === 'patients' && (
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Actions</th></tr></thead><tbody>{patients.map(p => (<tr key={p._id} className="border-b hover:bg-gray-50"><td className="p-3">{p.name}</td><td className="p-3">{p.email}</td><td className="p-3"><button onClick={() => deleteUser(p._id, 'patient')} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td></tr>))}</tbody></table></div>
        )}

        {activeTab === 'beds' && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Ward</h3>
            <form onSubmit={addBed} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <input type="text" name="ward" value={bedForm.ward} onChange={handleBedFormChange} placeholder="Ward Name" className="p-2 border rounded-md" required />
              <input type="number" name="total" value={bedForm.total} onChange={handleBedFormChange} placeholder="Total Beds" className="p-2 border rounded-md" required />
              <input type="number" name="available" value={bedForm.available} onChange={handleBedFormChange} placeholder="Available Beds" className="p-2 border rounded-md" required />
              <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Ward</button>
            </form>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Ward</th><th className="p-3">Total</th><th className="p-3">Available</th><th className="p-3">Actions</th></tr></thead><tbody>{beds.map(b => (<tr key={b._id} className="border-b hover:bg-gray-50">{editingBed && editingBed._id === b._id ? (<><td className="p-3 font-semibold">{b.ward}</td><td className="p-2"><input type="number" name="total" value={editingBed.total} onChange={handleEditFormChange} className="w-24 p-1 border rounded-md" /></td><td className="p-2"><input type="number" name="available" value={editingBed.available} onChange={handleEditFormChange} className="w-24 p-1 border rounded-md" /></td><td className="p-3 flex gap-2"><button onClick={updateBed} className="text-green-600 font-semibold">Save</button><button onClick={() => setEditingBed(null)} className="text-gray-500">Cancel</button></td></>) : (<><td className="p-3 font-semibold">{b.ward}</td><td className="p-3">{b.total}</td><td className="p-3 text-green-600 font-bold">{b.available}</td><td className="p-3 flex gap-4"><button onClick={() => setEditingBed({ ...b })} className="text-blue-500 hover:text-blue-700"><EditIcon /></button><button onClick={() => deleteBed(b._id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td></>)}</tr>))}</tbody></table></div>
          </div>
        )}

        {activeTab === 'appointments' && (
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Date & Time</th><th className="p-3">Status</th></tr></thead><tbody>{appointments.map(appt => (<tr key={appt._id} className="border-b hover:bg-gray-50"><td className="p-3">{appt.patient?.name}</td><td className="p-3">{appt.doctor?.name}</td><td className="p-3">{new Date(appt.date).toLocaleDateString()} {appt.time}</td><td className="p-3">{appt.status}</td></tr>))}</tbody></table></div>
        )}

        {activeTab === 'broadcast' && (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingBroadcast ? 'Edit Broadcast' : 'Send New Broadcast'}</h3>
                <form onSubmit={handleBroadcastSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <textarea value={editingBroadcast ? editingBroadcast.message : broadcastForm.message} name="message" onChange={handleBroadcastFormChange} placeholder="Enter message..." className="w-full p-2 border rounded-md" required/>
                    <select value={editingBroadcast ? editingBroadcast.audience : broadcastForm.audience} name="audience" onChange={handleBroadcastFormChange} className="w-full p-2 border rounded-md"><option value="All">All Users</option><option value="Doctors">Doctors Only</option><option value="Patients">Patients Only</option></select>
                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">{editingBroadcast ? 'Save Changes' : 'Send Broadcast'}</button>
                        {editingBroadcast && <button type="button" onClick={() => setEditingBroadcast(null)} className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600">Cancel Edit</button>}
                    </div>
                </form>

                <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-700">Broadcast History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left"><thead><tr className="bg-gray-100 text-sm text-gray-600 uppercase"><th className="p-3">Message</th><th className="p-3">Audience</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{broadcasts.map(b => (<tr key={b._id} className="border-b hover:bg-gray-50"><td className="p-3">{b.message}</td><td className="p-3">{b.audience}</td><td className="p-3">{b.isActive ? <span className="text-green-600 font-bold">Active</span> : 'Inactive'}</td><td className="p-3 flex gap-4"><button onClick={() => setEditingBroadcast(b)} className="text-blue-500 hover:text-blue-700"><EditIcon /></button><button onClick={() => cancelBroadcast(b._id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button></td></tr>))}</tbody></table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;