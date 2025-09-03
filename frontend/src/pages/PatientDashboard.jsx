import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeGreeting } from "../utils/greetings";
import BroadcastBanner from "../components/BroadcastBanner";

// --- Icon Components ---
// A collection of SVG icons for a consistent and clean look.
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4 mr-2 inline text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const NoAppointmentIcon = () => <svg className="mx-auto mb-4 h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13H9m12-4l-1.5 1.5M9 13h.01" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 17.657l-2.828 2.828M17.657 6.343l2.828-2.828m0 0l-2.828 2.828M3 21v-4m4 4H3m14.657-11.343l-2.828-2.828M12 3v2m0 14v2m-6.343-2.343l2.828-2.828m0 0l2.828 2.828m0 0l2.828 2.828m-11.314-5.657l2.828-2.828" /></svg>;
const DoctorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536m3.536-3.536l3.536-3.536m-3.536 3.536l-3.536-3.536M12 18.364V12m0 0V5.636m0 6.364l-3.536 3.536m3.536-3.536l3.536 3.536" /></svg>;


function PatientDashboard() {
  // --- STATE MANAGEMENT ---
  // This section holds all the dynamic data for the component.
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bedRequest, setBedRequest] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ doctor: "", date: "", time: "", symptoms: "", report: null });
  const [isAnalyzing, setIsAnalyzing] = useState(false); // For symptom analysis
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(null); // Tracks which report is being analyzed by its ID
  const [analysisResult, setAnalysisResult] = useState(null); // Stores the AI analysis result for the report

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();


  // --- DATA FETCHING ---
  // This useEffect hook fetches all necessary data from the backend when the component first loads.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, doctorsRes, bedRequestRes] = await Promise.all([
          axios.get("http://localhost:5000/api/patient/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/doctors", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/patient/my-bed-request", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data.filter(doc => doc.status === 'Available'));
        setBedRequest(bedRequestRes.data);
      } catch (err) {
        toast.error("Could not load your data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);


  // --- HANDLER FUNCTIONS ---
  // These functions handle all user interactions on the page.

  // Updates form state on input change.
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // Submits the new appointment form.
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

  // Generates time slots for the booking form.
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i < 21; i++) slots.push(`${String(i).padStart(2, '0')}:00`);
    return slots;
  };
  const timeSlots = generateTimeSlots();
  
  // Returns color-coded badges for appointment status.
  const getStatusBadge = (status) => {
    const statuses = { 'Scheduled': 'bg-blue-100 text-blue-800', 'Completed': 'bg-green-100 text-green-800', 'Cancelled': 'bg-red-100 text-red-800' };
    return statuses[status] || 'bg-gray-100 text-gray-800';
  };
  
  // Formats time strings into a readable format (e.g., 9:00 AM).
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Handles user logout.
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // --- AI FEATURE HANDLERS ---

  // Analyzes patient symptoms using Gemini AI to suggest a doctor.
  const handleAnalyzeSymptoms = async () => {
    if (!formData.symptoms) return toast.error("Please enter your symptoms first.");
    setIsAnalyzing(true);
    try {
      const specializations = [...new Set(doctors.map(d => d.specialization))].join(", ");
      const systemPrompt = `You are a medical assistant. Based on the user's symptoms, suggest a specialization from this list: ${specializations}. Return ONLY the specialization name.`;
      const userQuery = formData.symptoms;
      const apiKey = "AIzaSyDIuTAjGHZrfHP2B02MYZKGbVBy1LA4VOY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      const suggestedSpecialization = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();
      if (suggestedSpecialization) {
        const suggestedDoctor = doctors.find(doc => doc.specialization === suggestedSpecialization);
        if (suggestedDoctor) {
          setFormData({ ...formData, doctor: suggestedDoctor._id });
          toast.success(`🤖 AI suggests a ${suggestedSpecialization}. Doctor selected!`);
        } else {
          toast.info(`🤖 AI suggests a ${suggestedSpecialization}, but no doctor is available.`);
        }
      } else {
        toast.error("AI could not determine a specialization.");
      }
    } catch (err) {
      toast.error("Error analyzing symptoms.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Analyzes an uploaded medical report using Gemini Vision AI.
 const handleAnalyzeReport = async (appointmentId) => {
  setIsAnalyzingReport(appointmentId);
  try {
    // Report fetch karna (agar chahiye ho)
    const appt = appointments.find(a => a._id === appointmentId);

    // Symptoms + Report data combine karke AI ko bhejo
    const payload = {
      contents: [{
        parts: [{
          text: `Analyze this patient report and symptoms:
          Symptoms: ${appt.symptoms}
          Report: ${appt.report}
          
          Return JSON only:
          {
            "summary": "...",
            "potential_problem": "...",
            "suggested_action": "...",
            "doctor_suggestion": "...",
            "disclaimer": "..."
          }`
        }]
      }]
    };

    const apiKey = "AIzaSyDIuTAjGHZrfHP2B02MYZKGbVBy1LA4VOY";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = { summary: text || "No summary", disclaimer: "Consult a doctor for accuracy." };
    }

    setAnalysisResult(parsed);
  } catch (err) {
    toast.error("Failed to analyze report.");
  } finally {
    setIsAnalyzingReport(null);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <BroadcastBanner />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{getTimeGreeting()}, {user?.name || "Patient"}! 👋</h1>
        <p className="text-gray-500 mb-8">Welcome to your health dashboard.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- Appointments Section --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Your Appointments</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center space-x-2">
                  <PlusCircleIcon /><span>Book New</span>
                </button>
              </div>
              
              {loading ? <p>Loading...</p> : appointments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                  <NoAppointmentIcon />
                  <h3 className="text-xl font-semibold text-gray-700">No appointments yet</h3>
                  <p className="text-gray-500 mb-4">Let's book your first one!</p>
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Book Appointment</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-start">
                        <div><h3 className="text-lg font-bold text-gray-800">Dr. {appt.doctor?.name}</h3><p className="text-sm text-blue-600 font-semibold">{appt.doctor?.specialization || 'General'}</p></div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(appt.status || 'Scheduled')}`}>{appt.status || 'Scheduled'}</span>
                      </div>
                      <div className="border-t my-3 border-gray-200"></div>
                      <div className="flex items-center text-sm text-gray-700 mb-3"><CalendarIcon /> {new Date(appt.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}<ClockIcon /> {formatTime(appt.time)}</div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"><span className="font-semibold text-gray-800">Symptoms:</span> {appt.symptoms}</p>
                      
                      {/* This is the Report Analysis section */}
                      {appt.report && (
                        <div className="mt-4 border-t pt-4 flex items-center gap-4">
                          <a href={`http://localhost:5000/${appt.report}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Report</a>
                          <button onClick={() => handleAnalyzeReport(appt._id)} disabled={isAnalyzingReport === appt._id} className="flex items-center bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-full text-sm hover:bg-purple-200 disabled:opacity-50">
                            <SparklesIcon />{isAnalyzingReport === appt._id ? 'Analyzing...' : 'Analyze with AI'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- Right Column --- */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Profile</h2>
                {user && (<div className="flex items-center space-x-4 mb-4"><UserCircleIcon /><div><p className="font-bold text-lg text-gray-800">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></div></div>)}
                <button onClick={handleLogout} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">Logout</button>
            </div>

            {bedRequest && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">{/* ... Bed Request Status UI ... */}</div>
            )}
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Links</h2>
                <ul className="space-y-4">
                    <li><Link to="/doctors" className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"><DoctorIcon /><span className="ml-3">Find a Doctor</span></Link></li>
                    <li><Link to="/beds" className="flex items-center text-gray-700 hover:text-green-600 font-medium transition-colors"><BedIcon /><span className="ml-3">Check Bed Status</span></Link></li>
                    <li><Link to="/contact" className="flex items-center text-gray-700 hover:text-red-600 font-medium transition-colors"><SupportIcon /><span className="ml-3">Contact Support</span></Link></li>
                </ul>
            </div>
          </div>
        </div>
      </main>

      {/* --- Booking Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea name="symptoms" placeholder="Describe your symptoms (e.g., 'fever and headache for 3 days')" value={formData.symptoms} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3" rows="3" required />
              <button type="button" onClick={handleAnalyzeSymptoms} disabled={isAnalyzing} className="w-full flex items-center justify-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-purple-300">
                <SparklesIcon />{isAnalyzing ? "Analyzing..." : "Analyze Symptoms & Suggest Doctor"}
              </button>
              <select name="doctor" value={formData.doctor} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3" required>
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doc) => <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>)}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className="w-full border-gray-300 rounded-lg p-3" required />
                <select name="time" value={formData.time} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3" required>
                  <option value="">-- Select Time Slot --</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{formatTime(slot)}</option>)}
                </select>
              </div>
              <input type="file" name="report" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 hover:file:bg-blue-100" />
              <div className="flex justify-end space-x-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AI Report Analysis Result Modal --- */}
      {analysisResult && analysisResult &&(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><SparklesIcon /> AI Report Analysis</h2>
            <div className="space-y-4 text-gray-700">
                <div><h3 className="font-semibold">Summary</h3><p className="bg-gray-50 p-3 rounded-md">{analysisResult.summary}</p></div>
                <div><h3 className="font-semibold">Potential Problem</h3><p className="bg-gray-50 p-3 rounded-md">{analysisResult.potential_problem}</p></div>
                <div><h3 className="font-semibold">Suggested Action</h3><p className="bg-gray-50 p-3 rounded-md">{analysisResult.suggested_action}</p></div>
                 <div><h3 className="font-semibold">Doctor Suggestion</h3><p className="bg-gray-50 p-3 rounded-md">{analysisResult.doctor_suggestion || "Consult a specialist for further details."}  </p></div>
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm"><p><strong>Disclaimer:</strong> {analysisResult.disclaimer}</p></div>
            </div>
            <div className="flex justify-end mt-6"><button onClick={() => setAnalysisResult(false)} className="bg-gray-300 py-2 px-6 rounded-lg">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
