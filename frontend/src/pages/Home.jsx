import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// --- Local Images Import ---
import heroBg from '../assets/hero-bg.jpg';
import statsBg from '../assets/stats-bg.jpg';
import doc1 from '../assets/doctor1.jpg';
import doc2 from '../assets/doctor2.jpg';
import doc3 from '../assets/doctor3.jpg';
import patient1 from '../assets/patient1.jpg';
import patient2 from '../assets/patient2.jpg';

// --- Helper Components ---
const StepIcon = ({ icon, step, title }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-blue-100 text-blue-600 border-4 border-white shadow-lg">
            <span className="text-4xl">{icon}</span>
        </div>
        <p className="text-xl font-semibold text-gray-800">{step}</p>
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    </div>
);

const CountUp = ({ end }) => {
    const [count, setCount] = useState(0);
    const duration = 2000; // 2 seconds

    useEffect(() => {
        let start = 0;
        const endValue = parseInt(end) || 0;
        if (start === endValue) return;

        const incrementTime = Math.abs(Math.floor(duration / endValue));
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === endValue) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [end]);

    return <span className="text-5xl font-bold">{count}+</span>;
};


const Home = () => {
  const [stats, setStats] = useState({ doctors: 0, beds: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctorsRes, bedsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/doctors"),
          axios.get("http://localhost:5000/api/beds")
        ]);
        setStats({
          doctors: doctorsRes.data.length,
          beds: bedsRes.data.reduce((acc, ward) => acc + ward.available, 0),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats({ doctors: 10, beds: 50 }); // Fallback values
      }
    };
    fetchStats();
  }, []);

  return (
     <div className="min-h-screen bg-white text-gray-800">
      {/* --- Hero Section --- start*/}
      <section className="relative h-screen flex items-center justify-center text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute top-0 left-0 w-full h-full bg-blue-900 opacity-60"></div>
        </div>
        <div className="relative z-10 text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            AI Powered Healthcare
          </h1>
          
          {/* ✅ attractive quote on hero image */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Where Technology Meets Compassion. Your Health, Intelligently Managed.
          </p>
          {/* ✅ Book Appointment button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
              Book Appointment
            </Link>
          </div>

          {/* ✅ (Feature Highlights) Quote k niche */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="font-semibold">AI-Powered Suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="font-semibold">Verified Doctors</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="font-semibold">24/7 Access</span>
            </div>
          </div>
        </div>
      </section>
      {/* --- Hero Section --- end*/}



      {/* --- Steps Explanation Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Booking in 3 Easy Steps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-16">
                Get expert medical care without any hassle.
            </p>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* Icons (in front) */}
                <div className="relative z-10"><StepIcon icon="👤" step="Step 1" title="Register & Login" /></div>
                <div className="relative z-10"><StepIcon icon="🩺" step="Step 2" title="Find Your Doctor" /></div>
                <div className="relative z-10"><StepIcon icon="🗓️" step="Step 3" title="Book a Time Slot" /></div>
                
                {/* Arrow Connectors (behind) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-full z-0">
                    {/* Arrow 1 -> 2 */}
                    <svg className="absolute w-1/3 left-[20%]" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,20 C30,0 70,0 100,20" stroke="#d1d5db" strokeWidth="2" fill="none" strokeDasharray="5, 5"/>
                        <path d="M96,18 L100,20 L96,22" stroke="#d1d5db" strokeWidth="2" fill="none"/>
                    </svg>
                    {/* Arrow 2 -> 3 */}
                    <svg className="absolute w-1/3 left-[53%]" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,20 C30,40 70,40 100,20" stroke="#d1d5db" strokeWidth="2" fill="none" strokeDasharray="5, 5"/>
                        <path d="M96,18 L100,20 L96,22" stroke="#d1d5db" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
            </div>
        </div>
      </section>
      
      {/* --- Meet Our Specialists Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Meet Our Specialists</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Experienced doctors dedicated to your health.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                    <img src={doc1} alt="Dr. Sharma" className="w-full h-64 object-cover"/>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold">Dr.Aryan Pandey</h3>
                        <p className="text-blue-600">Cardiologist</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                    <img src={doc2} alt="Dr. Gupta" className="w-full h-64 object-cover"/>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold">Dr. Priya Gupta</h3>
                        <p className="text-blue-600">Dermatologist</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                    <img src={doc3} alt="Dr. Singh" className="w-full h-64 object-cover"/>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold">Dr. A. K. Singh</h3>
                        <p className="text-blue-600">Neurologist</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Stats Section with Count Up --- */}
      <section 
        className="relative py-20 bg-cover bg-center" 
        style={{ backgroundImage: `url(${statsBg})` }}
      >
        <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
        <div className="relative container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-12">Our Hospital at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6"><CountUp end={stats.doctors} /><p>Specialist Doctors</p></div>
            <div className="p-6"><CountUp end={24} /><p>Hours Service</p></div>
            <div className="p-6"><CountUp end={stats.beds} /><p>Available Beds</p></div>
            <div className="p-6"><CountUp end={200} /><p>Happy Patients</p></div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12">What Our Patients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <img src={patient1} alt="Patient 1" className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white"/>
                    <p className="italic text-gray-600 my-4">"Booking an appointment was so easy. The AI feature helped me find the right doctor instantly. Highly recommended!"</p>
                    <p className="font-bold text-gray-800">- Anjali Sharma</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <img src={patient2} alt="Patient 2" className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white"/>
                    <p className="italic text-gray-600 my-4">"The doctors are very professional and the live status feature is very helpful. A truly modern hospital experience."</p>
                    <p className="font-bold text-gray-800">- Rohan Verma</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;