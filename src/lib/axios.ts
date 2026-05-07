// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔥 ADD THIS BLOCK
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});