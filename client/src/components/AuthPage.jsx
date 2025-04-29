import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function AuthPage({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Determine initial mode from route
  const [isRegistering, setIsRegistering] = useState(location.pathname === "/register");

  // Sync state with route
  useEffect(() => {
    setIsRegistering(location.pathname === "/register");
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-200 to-yellow-100 relative">
      <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-yellow-300 rounded-full opacity-20 -z-10" />
      <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-red-300 rounded-full opacity-20 -z-10" />
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-3xl overflow-hidden">
        {/* Left Side */}
        <div className="bg-teal-500 flex flex-col justify-center items-center w-1/2 p-10 text-white relative">
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mb-4">
              <span className="font-bold text-lg tracking-wider">HomeClean</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{isRegistering ? "Welcome!" : "Welcome Back!"}</h2>
            <p className="text-base opacity-90 mb-8 text-center max-w-xs">
              {isRegistering
                ? "To keep connected with us please login or create an account with your personal info"
                : "To keep connected with us please login with your personal info"}
            </p>
            <div className="flex flex-col gap-3 w-full items-center">
              {!isRegistering && (
                <button
                  className="border border-white text-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-teal-500 transition w-full"
                  onClick={() => { setIsRegistering(true); navigate("/register"); }}
                >
                  Create Account
                </button>
              )}
              {isRegistering && (
                <button
                  className="border border-white text-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-teal-500 transition w-full"
                  onClick={() => { setIsRegistering(false); navigate("/login"); }}
                >
                  Sign In
                </button>
              )}
              <button
                className="border border-white text-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-teal-500 transition w-full"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
        {/* Right Side (Form) */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
