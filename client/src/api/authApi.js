// src/api/authApi.js
const API = "http://127.0.0.1:5000";

export const authApi = {
  async register(data) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Register failed");
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
};
