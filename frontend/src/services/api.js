import axios from "axios";

// Read backend URL from environment variable (set in Vercel)
const rawBackend = process.env.REACT_APP_BACKEND_URL || "";

// Remove trailing slashes if any
const backendURL = rawBackend.replace(/\/+$/, "");

// If backend URL is missing in env, fallback to current origin (useful for localhost)
const finalURL = backendURL || window.location.origin;

const api = axios.create({
  baseURL: `${finalURL}/api`,
  withCredentials: true, // safe even if not using cookies
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
