// src/hooks/useAuth.js
import { useState } from "react";
import { authApi } from "../api/authApi";

export default function useAuth() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
  const res = await authApi.login({ email, password });

  const userData = {
    token: res.token || "",   // backend kamu mungkin ga ada JWT, bisa kosong
    userId: res.id || res.user_id || 1, // pastikan user.id ada
    name: res.name,
    email: res.email,
  };

  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};


  const register = async (data) => {
    await authApi.register(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, register, logout };
}
