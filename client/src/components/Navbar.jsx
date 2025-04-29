import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  // Get first name if logged in
  const firstName = user && user.user && user.user.first_name ? user.user.first_name : "";

  const isAdminPage = window.location.pathname.startsWith("/admin");

  return (
    <header className="flex justify-between items-center px-10 py-4">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>
      <nav className="flex gap-8 items-center text-lg">
        {isAdminPage ? (
          <Link to="/admin-dashboard" className="text-primary font-medium hover:text-cta transition">Admin Dashboard</Link>
        ) : (
          <>
            <Link to="/" className="text-primary font-medium hover:text-cta transition">Home</Link>
            <Link to="/services" className="text-primary font-medium hover:text-cta transition">Services</Link>
            <Link to="/about" className="text-primary font-medium hover:text-cta transition">About</Link>
            <Link to="/contact" className="text-primary font-medium hover:text-cta transition">Contact</Link>
            <Link to="/dashboard" className="text-primary font-medium hover:text-cta transition">Dashboard</Link>
          </>
        )}
        {!user ? (
          <Link to="/login" className="ml-2 bg-cta text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary transition">Login</Link>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="ml-2 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-700 focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <AccountCircleIcon fontSize="large" />
              <span className="hidden md:inline">{firstName || "Profile"}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                >
                  Profile Settings
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
