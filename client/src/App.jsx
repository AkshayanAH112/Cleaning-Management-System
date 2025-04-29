import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ServicesAdmin from "./pages/ServicesAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import BookingForm from "./pages/BookingForm";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data, navigate) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    // Redirect admin to admin dashboard, others to home
    if (data && data.user && data.user.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  // Use the same gradient theme for all pages
  const gradientBg = "min-h-screen bg-gradient-to-br from-teal-400 via-blue-200 to-yellow-100";

  return (
    <div className={gradientBg}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          user && user.user && user.user.isAdmin ? <Navigate to="/admin" /> : <Home user={user} />
        } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            user && user.user && !user.user.isAdmin ? (
              <Dashboard token={user.token} isAdmin={user.user.isAdmin} />
            ) : user && user.user && user.user.isAdmin ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user && user.user && user.user.isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            user && user.user && user.user.isAdmin ? (
              <AdminDashboard token={user.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/services-admin"
          element={
            user && user.user && user.user.isAdmin ? (
              <ServicesAdmin token={user.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
