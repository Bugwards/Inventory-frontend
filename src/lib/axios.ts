// src/lib/axios.ts

/*import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Login and register do not need an existing JWT
  const isAuthRequest = config.url?.startsWith("/api/auth/");

  if (token && !isAuthRequest) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});*/
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Login and register do not need an existing JWT
  const isAuthRequest = config.url?.startsWith("/api/auth/");

  if (token && !isAuthRequest) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
