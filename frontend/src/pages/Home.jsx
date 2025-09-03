import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// --- Local Images Import ---

import heroBg from '../assets/hero-bg-new.jpg';
import whyUsBg from '../assets/why-us-bg.jpg';
import doc1 from '../assets/doctor1.jpg';
import doc2 from '../assets/doctor2.jpg';
import doc3 from '../assets/doctor3.jpg';
import testimonialUser1 from '../assets/patient2.jpg';
import testimonialUser2 from '../assets/patient1.jpg';


// --- SVG Icon Components (Improved & Centralized) ---
const IconWrapper = ({ children }) => <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">{children}</div>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 17.657l-2.828 2.828M17.657 6.343l2.828-2.828m0 0l-2.828 2.828M3 21v-4m4 4H3m14.657-11.343l-2.828-2.828M12 3v2m0 14v2m-6.343-2.343l2.828-2.828m0 0l2.828 2.828m0 0l2.828 2.828m-11.314-5.657l2.828-2.828" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const StethoscopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14v-4c0-2.2-1.8-4-4-4H9c-2.2 0-4 1.8-4 4v4c0 1.1.9 2 2 2h1.2c.4 0 .7.1 1 .4l.8 1.1c.4.5 1.1.8 1.9.8s1.5-.3 1.9-.8l.8-1.1c.3-.3.6-.4 1-.4H17c1.1 0 2-.9 2-2zm-9-4h2m-1 8v2m0 0a2 2 0 104 0v-2" /></svg>;
const CalendarDaysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;


const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Using dummy data as backend might not be running
        const dummyDoctors = [
          // --- Common & Primary Care ---
          { specialization: 'General Physician' },
          { specialization: 'Internal Medicine' },
          { specialization: 'Pediatrician' }, // Bachon ke doctor
          { specialization: 'Geriatrician' }, // Buzurgon ke doctor

          // --- Heart & Blood ---
          { specialization: 'Cardiologist' }, // Dil ke doctor
          { specialization: 'Hematologist' }, // Khoon se judi beemariyan

          // --- Bones, Joints & Muscles ---
          { specialization: 'Orthopedic Surgeon' }, // Haddi ke doctor
          { specialization: 'Rheumatologist' }, // Jodon aur gathiya ke doctor
          { specialization: 'Physiotherapist' },

          // --- Brain, Spine & Nerves ---
          { specialization: 'Neurologist' }, // Dimaag aur nas ke doctor
          { specialization: 'Neurosurgeon' },
          { specialization: 'Psychiatrist' }, // Maansik swasthya
          { specialization: 'Psychologist' },

          // --- Skin & Hair ---
          { specialization: 'Dermatologist' }, // Twacha (skin) ke doctor
          { specialization: 'Trichologist' }, // Baal (hair) ke expert

          // --- Digestive System ---
          { specialization: 'Gastroenterologist' }, // Pet aur paachan tantra
          { specialization: 'Hepatologist' }, // Liver ke expert

          // --- Eyes, Nose, Throat (ENT) ---
          { specialization: 'Ophthalmologist' }, // Aankh ke doctor
          { specialization: 'ENT Specialist' }, // Naak, kaan, gale ke doctor

          // --- Women's Health ---
          { specialization: 'Gynecologist' }, // Mahila rog visheshagya
          { specialization: 'Obstetrician' }, // Prasuti vigyan (Pregnancy)

          // --- Hormones & Glands ---
          { specialization: 'Endocrinologist' }, // Hormones, Diabetes, Thyroid

          // --- Kidneys ---
          { specialization: 'Nephrologist' }, // Kidney ke doctor
          { specialization: 'Urologist' }, // Mutra marg (Urinary tract)

          // --- Lungs & Breathing ---
          { specialization: 'Pulmonologist' }, // Fefdon ke doctor

          // --- Cancer ---
          { specialization: 'Oncologist' }, // Cancer ke doctor

          // --- Allergies ---
          { specialization: 'Allergist' },
          { specialization: 'Immunologist' },

          // --- Other Specialties ---
          { specialization: 'Dentist' }, // Daant ke doctor
          { specialization: 'Radiologist' }, // X-ray, CT Scan, MRI
          { specialization: 'Pathologist' }, // Blood test, lab reports
          { specialization: 'General Surgeon' },
          { specialization: 'Plastic Surgeon' }
        ];
        setDoctors(dummyDoctors);
        // In production, you would use axios:
        // const res = await axios.get("http://localhost:5000/api/doctors");
        // setDoctors(res.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast.error("Could not fetch doctor specializations.");
      }
    };
    fetchDoctors();
  }, []);

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms) return toast.error("Please describe your symptoms first.");
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const specializations = [...new Set(doctors.map(d => d.specialization))].join(", ");
      if (!specializations) {
        toast.error("Doctor specializations not loaded yet. Please wait a moment.");
        setIsAnalyzing(false);
        return;
      }

      const systemPrompt = `You are a medical assistant. Based on the user's symptoms, suggest a specialization from this list: ${specializations}. Your response must be ONLY the specialization name and nothing else. For example, if the best fit is Cardiologist, your entire response should be "Cardiologist".`;


      const apiKey = "AIzaSyDIuTAjGHZrfHP2B02MYZKGbVBy1LA4VOY";

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: `Symptoms: "${symptoms}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      const suggestedSpecialization = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();

      if (suggestedSpecialization && specializations.includes(suggestedSpecialization)) {
        setAnalysisResult(suggestedSpecialization);
      } else {
        toast.error("AI could not determine a suitable specialization. Please try describing your symptoms differently.");
      }
    } catch (err) {
      console.error("Symptom analysis error:", err);
      toast.error("An error occurred while analyzing symptoms. Please check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* --- Hero Section --- */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute top-0 left-0 w-full h-full bg-black/60" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Intelligent Healthcare, <br /> Instantly Accessible.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
            Stop waiting, start healing. Use our AI to find the right doctor and book your appointment in minutes.
          </p>
          <a href="#symptom-checker" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
            Check Symptoms Now
          </a>
        </div>
      </section>

      {/* --- Stats Bar Section --- */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600">100+</h3>
            <p className="text-slate-500">Verified Doctors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">20+</h3>
            <p className="text-slate-500">Specializations</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">5k+</h3>
            <p className="text-slate-500">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
            <p className="text-slate-500">AI Assistance</p>
          </div>
        </div>
      </section>


      {/* --- Why Choose Us Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="text-blue-600 font-semibold uppercase">Why MediCare AI?</span>
            <h2 className="text-4xl font-bold mb-6 mt-2">A Smarter Way to Manage Your Health</h2>
            <div className="space-y-6 text-slate-600">
              <div className="flex items-start gap-4">
                <IconWrapper><SparklesIcon /></IconWrapper>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">AI-Powered Guidance</h3>
                  <p>Instantly find the right specialist based on your symptoms, saving you time and guesswork.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconWrapper><CheckCircleIcon /></IconWrapper>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">Seamless Booking</h3>
                  <p>Book appointments with verified doctors in just a few clicks. No more phone calls or waiting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconWrapper><CalendarDaysIcon /></IconWrapper>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">Live Transparency</h3>
                  <p>Check real-time availability of doctors and hospital beds, helping you make informed decisions quickly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src={whyUsBg} alt="Doctor consulting patient" className="rounded-2xl shadow-2xl w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* --- AI Symptom Analyzer Section --- */}
      <section id="symptom-checker" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Don't Know Where to Start?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-10">
            Let our AI assistant guide you. Just describe your symptoms below.
          </p>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <textarea
              className="w-full p-4 border-2 border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows="4"
              placeholder="e.g., 'I have a sharp pain in my chest and feel dizzy...'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <button
              onClick={handleAnalyzeSymptoms}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <SparklesIcon />
              {isAnalyzing ? "Analyzing Symptoms..." : "Get AI Suggestion"}
            </button>
            {analysisResult && (
              <div className="mt-6 text-left p-5 bg-blue-50 rounded-lg border-l-4 border-blue-500 animate-fade-in">
                <h3 className="font-bold text-lg text-slate-800">AI Recommendation</h3>
                <p className="text-slate-700 mt-2">Based on your symptoms, we recommend consulting a <strong className="text-blue-700">{analysisResult}</strong>.</p>
                <button
                  onClick={() => navigate("/register")}
                  className="mt-4 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition"
                >
                  Find a {analysisResult}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Get Care in 3 Easy Steps</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">Get expert medical care without any hassle.</p>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-20" />

            <div className="relative flex flex-col items-center p-6">
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 border-4 border-white shadow-md">
                <UserPlusIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Step 1: Register</h3>
              <p className="text-slate-500">Create your account to get started.</p>
            </div>
            <div className="relative flex flex-col items-center p-6">
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 border-4 border-white shadow-md">
                <StethoscopeIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Step 2: Find Doctor</h3>
              <p className="text-slate-500">Search for specialists or use our AI.</p>
            </div>
            <div className="relative flex flex-col items-center p-6">
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 border-4 border-white shadow-md">
                <CalendarDaysIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Step 3: Book Slot</h3>
              <p className="text-slate-500">Choose a convenient time and book.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Meet Our Specialists Section --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Meet Some of Our Specialists</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">Experienced doctors dedicated to your well-being.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
              <img src={doc1} alt="Dr. Aryan Pandey" className="w-full h-64 object-cover object-top" />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold text-slate-800">Dr. Aryan Pandey</h3>
                <p className="text-blue-600 font-medium">Cardiologist</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
              <img src={doc2} alt="Dr. Priya Gupta" className="w-full h-64 object-cover object-top" />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold text-slate-800">Dr. Priya Gupta</h3>
                <p className="text-blue-600 font-medium">Dermatologist</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
              <img src={doc3} alt="Dr. Sameer Khan" className="w-full h-64 object-cover object-top" />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold text-slate-800">Dr. Sameer Khan</h3>
                <p className="text-blue-600 font-medium">Neurologist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
              <p className="text-slate-600 mb-6">"This platform is a lifesaver! The AI symptom checker pointed me to the right specialist immediately, and I booked an appointment within five minutes. Highly recommended!"</p>
              <div className="flex items-center">
                <img src={testimonialUser1} alt="Rohan Verma" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <p className="font-semibold text-slate-800">Rohan Verma</p>
                  <p className="text-slate-500 text-sm">Patient</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
              <p className="text-slate-600 mb-6">"Booking an appointment used to be a huge hassle. With MediCare AI, the process is incredibly smooth and transparent. I love that I can see the doctor's availability in real-time."</p>
              <div className="flex items-center">
                <img src={testimonialUser2} alt="Anjali Sharma" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <p className="font-semibold text-slate-800">Anjali Sharma</p>
                  <p className="text-slate-500 text-sm">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="max-w-2xl mx-auto mb-8">Join thousands of patients who trust MediCare AI for faster, smarter healthcare.</p>
          <button onClick={() => navigate("/register")} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
            Book an Appointment
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;