import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

// Interceptor de request: agrega el token si existe
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // fuera de un componente → getState()
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response: si el backend responde 401, la sesión ya no es válida
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
