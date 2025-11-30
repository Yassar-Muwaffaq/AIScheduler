// src/api/authApi.js
import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://127.0.0.1:5000/api/users",
  withCredentials: true, // kalau butuh cookie
});

export const login = async ({ email, password }) => {
  const res = await authApi.post("/login", { email, password });
  return res.data;
};

export const register = async (data) => {
  const res = await authApi.post("/register", data);
  return res.data;
};
