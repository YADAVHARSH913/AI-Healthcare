import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // ✅ Listen to localStorage changes (Login/Logout)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white py-4 px-8 flex justify-between items-center shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold">MediCare 🏥</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {/* ✅ Role Based Links */}
        {user?.role === "patient" && (
          <Link to="/patient/dashboard" className="hover:underline">
            My Dashboard
          </Link>
        )}

        {user?.role === "doctor" && (
          <Link to="/doctor/dashboard" className="hover:underline">
            Doctor Dashboard
          </Link>
        )}

        {!user ? (
           <>
            <Link to="/login" className="mx-3 hover:underline">Login</Link>
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-4 py-2 rounded ml-2 font-semibold hover:bg-gray-100"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
