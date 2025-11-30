import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError("Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <form
        onSubmit={submitRegister}
        className="bg-gray-800/40 border border-gray-700/40 backdrop-blur-xl p-10 rounded-2xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-semibold text-white text-center">Sign Up</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div>
          <label className="text-gray-300 text-sm">Full Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            required
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 bg-gray-900/40 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            required
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 bg-gray-900/40 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            required
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 bg-gray-900/40 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-full hover:bg-blue-700 text-white"
        >
          Create Account
        </button>

        <p className="text-center text-gray-400 text-sm">
          Sudah punya akun?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-400 cursor-pointer">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
