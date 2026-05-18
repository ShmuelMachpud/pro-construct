import axios from "axios";

const axiosAuthService = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosAuthService.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuthService;
