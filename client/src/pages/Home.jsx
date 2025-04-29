import { Link, useNavigate } from "react-router-dom";
import PhoneIcon from '@mui/icons-material/Phone';
import heroImg from '../assets/hero.jpg';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Hero background image with opacity */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img src={heroImg} alt="Hero Background" className="w-full h-full object-cover opacity-60" />
      </div>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center px-10 py-8 gap-8 relative z-10">
        <div className="flex-1 max-w-xl pt-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
            Book Professional Cleaning<br />Services Easily
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Schedule, manage, and enjoy top-quality cleaning for your home or office. Fast, reliable, and secure booking with a satisfaction guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-cta text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary transition"
            >
              Book Now
            </button>
            <span className="flex items-center gap-3 text-primary mt-2 sm:mt-0">
              <span className="bg-accent bg-opacity-10 rounded-full p-3"><PhoneIcon className="text-cta" /></span>
              <span className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">CALL US NOW</span>
                <span className="font-bold text-xl">075-4830632</span>
              </span>
            </span>
          </div>
        </div>
        {/* Illustration removed */}
      </main>
    </div>
  );
}
