// src/hooks/useAuth.js
import { useState } from "react";
import { authApi } from "../api/authApi";

export default function useAuth() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });

    // backend harus return { token, user_id, name, email }
    const userData = {
      token: res.token,
      userId: res.user_id,
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
