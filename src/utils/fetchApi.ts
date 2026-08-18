import axios from 'axios';
import { getToken, setToken } from '@/services/AuthService';
import { AuthResponse } from '@/models/response/AuthResponse';

export const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  if (getToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`;
  }

  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        setToken(response.data.accessToken);

        return $api.request(originalRequest);
      } catch (error) {
        console.error('Not authorized in interceptors. Log:', error);
      }
    }

    throw error;
  },
);

export default $api;
