import React from "react";
import Slider from "react-slick"; // npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Slideshow */}
      <div className="w-full max-h-[500px] overflow-hidden">
        <Slider {...sliderSettings}>
          <div>
            <img src="https://img.freepik.com/premium-photo/cute-funny-monster-with-big-eyes-hilarious-mouth-generative-ai_124507-64658.jpg" alt="Doctor" className="w-full h-[500px] object-cover" />
          </div>
          <div>
            <img src="https://msmedical.care/wp-content/uploads/2023/04/opd1-1.jpg" alt="Medical" className="w-full h-[500px] object-cover" />
          </div>
          <div>
            <img src="https://www.geetanjalihospital.co.in/images/opd-02.jpg" alt="Patient" className="w-full h-[500px] object-cover" />
          </div>
        </Slider>
      </div>

      {/* 🔹 About Section */}
      <section className="py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to MediCare</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          MediCare is a smart healthcare platform where patients can easily book 
          appointments, doctors can manage consultations, and both stay connected 
          seamlessly. Simple, Secure and Fast.
        </p>
      </section>

      {/* 🔹 Features Section */}
      <section className="py-12 px-8 bg-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">📅 Easy Appointment</h3>
          <p className="text-gray-600">Patients can book appointments anytime, anywhere in just a few clicks.</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">👨‍⚕️ Doctor Dashboard</h3>
          <p className="text-gray-600">Doctors can view, update and manage their patient consultations effectively.</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">🔐 Secure Login</h3>
          <p className="text-gray-600">All user data is safe with secure authentication and role-based access.</p>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-green-600 text-white text-center py-4 mt-auto">
        <p>© {new Date().getFullYear()} MediCare. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
