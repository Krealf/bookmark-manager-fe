import axios from 'axios';
import { getToken } from '@/services/AuthService';

export const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;

  return config;
});

export default $api;
