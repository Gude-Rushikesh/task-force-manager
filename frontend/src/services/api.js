import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskforce_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taskforce_token");
      localStorage.removeItem("taskforce_user");
    }
    return Promise.reject(error);
  }
);

export function apiError(error) {
  return error.response?.data?.message || "Something went wrong";
}

export default api;
