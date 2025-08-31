import React, { useState } from 'react';
import { toast } from 'react-toastify'; 

// --- Assets ---
import contactHero from '../assets/contact-hero.jpg';

// --- Icon Components ---
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const Contact = () => {
    // ✅ Form data ke liye state banaya
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ handleSubmit function 
    const handleSubmit = (e) => {
        e.preventDefault();
        const { name } = formData;
        // Backend mein data bhejne ka logic yahaan aayega
        
        toast.success(`Thank you, ${name}! We'll be in touch soon.`);
        
        // Form ko clear kar do
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-white text-gray-800">

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${contactHero})` }}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl font-extrabold text-white">Contact Us</h1>
                    <p className="text-xl text-gray-200 mt-4">We're here to help. Reach out to us anytime.</p>
                </div>
            </section>

            {/* --- Contact Form & Details Section --- */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
                    {/* Left Column: Contact Details */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                        <p className="text-gray-600 mb-8">
                            Have a question or need support? Fill out the form or contact us through the details below. Our team will get back to you within 24 hours.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start"><LocationIcon /><div><h3 className="text-lg font-semibold">Our Office</h3><p className="text-gray-600">123 Health St, New Delhi, 110001, India</p></div></div>
                            <div className="flex items-start"><MailIcon /><div><h3 className="text-lg font-semibold">Email Us</h3><p className="text-gray-600">contact@medicareai.com</p></div></div>
                            <div className="flex items-start"><PhoneIcon /><div><h3 className="text-lg font-semibold">Call Us</h3><p className="text-gray-600">+91 12345 67890</p></div></div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ✅ Saare inputs ko controlled banaya */}
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                            <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} className="w-full p-3 border rounded-md" required></textarea>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* --- Map Section --- */}
            <section>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192378!2d77.06889754746092!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1664458312078!5m2!1sen!2sin" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hospital Location"
                ></iframe>
            </section>
        </div>
    );
};

export default Contact;