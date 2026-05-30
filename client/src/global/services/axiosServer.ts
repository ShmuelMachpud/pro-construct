import axios from "axios";
import { ENV } from "../config/environments";

const axiosInstance = axios.create({
  baseURL: `${ENV.SERVER_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
