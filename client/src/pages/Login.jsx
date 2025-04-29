import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      // Store JWT in localStorage
      if (data.token) localStorage.setItem("token", data.token);
      onLogin && onLogin(data, navigate); // Pass navigate to parent
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthPage mode="login">
      <form className="w-full max-w-xs" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Sign In</h2>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
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
          SIGN IN
        </button>
      </form>
    </AuthPage>
  );
}
