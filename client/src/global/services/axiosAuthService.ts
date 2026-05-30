import axios from "axios";
import { ENV } from "../config/environments";

const axiosAuthService = axios.create({
  baseURL: `${ENV.AUTH_SERVICE_URL}/api`,
});

axiosAuthService.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuthService;
