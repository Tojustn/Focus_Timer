import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/api"; // Updated to match your actual API path

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}${apiUrl}`
    : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error. Please check if the server is running and accessible.");
    } else if (error.response) {
      console.error(`Server responded with status ${error.response.status}`);
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;