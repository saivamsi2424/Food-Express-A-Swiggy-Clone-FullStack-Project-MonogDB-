import axios from "axios";

//const backendURL = process.env.REACT_APP_BACKEND_URL.replace(/\/+$/, "");

const backendURL = "http://localhost:3000"

const api = axios.create({
  baseURL: `${backendURL}/api`,  // NO DOUBLE SLASH POSSIBLE NOW
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
