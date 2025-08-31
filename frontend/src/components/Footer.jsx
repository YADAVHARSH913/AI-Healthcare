import React from "react";
import { Link } from "react-router-dom";

// --- Logo and Social Icon Components ---
const LogoIcon = () => (
  <svg className="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 21v-6m-6 0h12a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2z"></path>
    <path d="M9 12v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
  </svg>
);
const FacebookIcon = () => <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22.675 0h-21.35C.582 0 0 .583 0 1.325v21.351C0 23.418.582 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.742 0 1.325-.582 1.325-1.325V1.325C24 .583 23.418 0 22.675 0z"/></svg>;
const TwitterIcon = () => <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.375 4.743 3.415-1.782 1.378-4.033 2.193-6.467 2.193-.42 0-.834-.025-1.24-.073a13.95 13.95 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
const InstagramIcon = () => <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.297-1.459.717-2.126 1.384S.926 3.356.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.297.783.717 1.459 1.384 2.126.667.666 1.343 1.087 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.783-.297 1.459-.717 2.126-1.384.666-.667 1.087-1.343 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.297-.784-.717-1.459-1.384-2.126C21.314.926 20.644.506 19.86.21c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.06 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.06-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.07-4.85c.06-1.17.249-1.805.413-2.227.217-.562.477.96.896-1.382.42-.419.819.679 1.381-.896.422-.164 1.057-.36 2.227.413C8.415 2.18 8.797 2.16 12 2.16zm0 3.094a6.745 6.745 0 100 13.49 6.745 6.745 0 000-13.49zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>;


const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-gray-300 font-sans">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Logo and Mission */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <LogoIcon />
                <span className="text-2xl font-bold text-white">MediCare AI</span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                Revolutionizing healthcare with AI for a smarter, healthier future.
              </p>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Login & Status </h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/admin-login" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Book Appointment</Link></li>
                <li><Link to="/beds" className="text-gray-400 hover:text-white transition-colors">Bed Status</Link></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="lg:col-span-4">
                <h3 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Follow Us</h3>
                <p className="text-sm text-gray-400 mb-4">Join our community for the latest updates.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
                </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-gray-900">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MediCare AI. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Footer;