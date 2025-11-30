import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setErr("Email atau password salah");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-semibold mb-6 text-center">Welcome Back</h1>

        {err && <div className="text-red-400 text-sm mb-3">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700">
            Sign In
          </button>
        </form>

        <div className="text-center text-gray-400 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
