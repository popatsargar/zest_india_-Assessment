import axios from "axios";
import toast from "react-hot-toast";
import { clearAuthSession, getAccessToken } from "../utils/tokenStorage";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
      const isLoginRequest = error?.config?.url?.includes("/api/auth/login");
      if (!isLoginRequest && window.location.pathname !== "/login") {
        toast.error("Your session has expired. Please sign in again.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
