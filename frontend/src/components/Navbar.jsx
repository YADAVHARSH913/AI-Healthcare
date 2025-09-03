import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navBgClass = isHomePage && !isScrolled ? "bg-transparent" : "bg-white shadow-md";
  const textColorClass = isHomePage && !isScrolled ? "text-white" : "text-gray-800";

  return (
    // Applied the new font-sans class here, which will be 'Inter'
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${navBgClass}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with updated font style */}
        <Link to="/" className={`text-xl flex items-center gap-2 ${textColorClass}`}>
          <svg className="h-8 w-8 text-blue-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 21v-6m-6 0h12a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2z"></path><path d="M9 12v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path></svg>
          <span className="font-extrabold tracking-wide">MediCare AI</span>
        </Link>

        {/* Desktop Links with updated font style */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wider uppercase">
          <Link to="/" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>Home</Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin-dashboard" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>
                  Dashboard
                </Link>
              )}
              {user.role === "patient" && (
                <Link to="/patient/dashboard" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>
                  Dashboard
                </Link>
              )}
              {user.role === "doctor" && (
                <Link to="/doctor/dashboard" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-full transition duration-300 text-xs"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              {/* Ye sirf login na hone par dikhega */}
              <Link to="/admin-login" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>Admin</Link>
              <Link to="/login" className={`hover:text-blue-500 transition-colors ${textColorClass}`}>Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full transition duration-300">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden"><button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><svg className={`h-6 w-6 ${textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button></div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 py-4">
          <Link to="/" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/beds" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Bed Availability</Link>
          {user?.role === "patient" && <Link to="/patient/dashboard" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Dashboard</Link>}
          {user?.role === "doctor" && <Link to="/doctor/dashboard" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Doctor Dashboard</Link>}
          {user?.role === "admin" && <Link to="/admin-dashboard" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>}

          {!user ? (
            <>
              <Link to="/login" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-6 py-2" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="w-full text-left px-6 py-2 text-red-500 font-bold">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;