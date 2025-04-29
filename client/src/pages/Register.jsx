import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

export default function Register({ onRegister }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1000);
      onRegister && onRegister();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthPage mode="register">
      <form className="w-full max-w-xs" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Create Account</h2>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
        <div className="mb-4 flex items-center bg-gray-100 rounded px-3">
          <PersonIcon className="text-gray-400 mr-2" />
          <input
            className="bg-transparent w-full py-3 px-2 outline-none"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex items-center bg-gray-100 rounded px-3">
          <PersonIcon className="text-gray-400 mr-2" />
          <input
            className="bg-transparent w-full py-3 px-2 outline-none"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex items-center bg-gray-100 rounded px-3">
          <EmailIcon className="text-gray-400 mr-2" />
          <input
            className="bg-transparent w-full py-3 px-2 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 flex items-center bg-gray-100 rounded px-3">
          <LockIcon className="text-gray-400 mr-2" />
          <input
            className="bg-transparent w-full py-3 px-2 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-full w-full transition"
          type="submit"
        >
          SIGN UP
        </button>
      </form>
    </AuthPage>
  );
}
