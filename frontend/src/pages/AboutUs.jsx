import React from 'react';
import { Link } from 'react-router-dom';

// --- Assets Images---
import aboutHero from '../assets/about-hero.jpg'; 
import teamMember1 from '../assets/doctor1.jpg';
import teamMember2 from '../assets/doctor2.jpg';
import teamMember3 from '../assets/doctor3.jpg';
import ourStory from '../assets/our-story.jpg'; 

// --- Icon Components ---
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318-3.047a2.017 2.017 0 012.364 0L17 21V5.984A12.027 12.027 0 0021 5.984z" /></svg>;


const AboutUs = () => {
    return (
        <div className="bg-white text-gray-800">
            
            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${aboutHero})` }}>
                    <div className="absolute inset-0 bg-blue-800 opacity-60"></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl font-extrabold text-white">About MediCare AI</h1>
                    <p className="text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
                        We are a team of doctors, engineers, and innovators dedicated to revolutionizing healthcare through technology.
                    </p>
                </div>
            </section>

            {/* --- Our Story Section --- */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-blue-600 font-semibold uppercase">Our Story</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">The Genesis of MediCare AI</h2>
                        <p className="text-gray-600 mb-4">
                            MediCare AI was born from a simple yet powerful idea: healthcare should be simple, smart, and accessible to everyone. Our founders, a mix of seasoned doctors and tech visionaries, saw the everyday challenges faced by patients—long queues, difficulty in finding the right specialist, and fragmented medical records.
                        </p>
                        <p className="text-gray-600">
                            We decided to build a solution. An intelligent platform that not only streamlines hospital operations but also empowers patients to take control of their health journey. This is not just a project; it's our commitment to a healthier future.
                        </p>
                    </div>
                    <div>
                        <img src={ourStory} alt="Our Story" className="rounded-lg shadow-xl"/>
                    </div>
                </div>
            </section>
            
            {/* --- Our Values Section --- */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center">
                            <div className="bg-white bg-opacity-20 p-5 rounded-full mb-4"><HeartIcon /></div>
                            <h3 className="text-2xl font-semibold mb-2">Compassion</h3>
                            <p className="text-blue-200 max-w-xs">Every feature we build is designed with the patient's comfort and well-being in mind.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white bg-opacity-20 p-5 rounded-full mb-4"><LightBulbIcon /></div>
                            <h3 className="text-2xl font-semibold mb-2">Innovation</h3>
                            <p className="text-blue-200 max-w-xs">We constantly push the boundaries of technology to bring you the best healthcare solutions.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white bg-opacity-20 p-5 rounded-full mb-4"><ShieldCheckIcon /></div>
                            <h3 className="text-2xl font-semibold mb-2">Trust</h3>
                            <p className="text-blue-200 max-w-xs">Your data is sacred. We are committed to maintaining the highest standards of privacy and security.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Meet The Team Section --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-12">Meet Our Core Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden text-center">
                            <img src={teamMember1} alt="Dr. Aryan Pandey" className="w-full h-64 object-cover"/>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold">Dr. Aryan Pandey</h3>
                                <p className="text-blue-600">Lead Cardiologist</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden text-center">
                            <img src={teamMember2} alt="Dr. Priya Gupta" className="w-full h-64 object-cover"/>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold">Dr. Priya Gupta</h3>
                                <p className="text-blue-600">Head of AI Research</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden text-center">
                            <img src={teamMember3} alt="Dr. A. K. Singh" className="w-full h-64 object-cover"/>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold">Dr. A. K. Singh</h3>
                                <p className="text-blue-600">Chief Medical Officer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;