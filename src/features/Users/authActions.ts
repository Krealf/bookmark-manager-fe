import { createAsyncThunk } from '@reduxjs/toolkit';
import $api, { API_URL } from '@/utils/fetchApi';
import { AuthResponse } from '@/models/response/AuthResponse';
import axios, { isAxiosError } from 'axios';
import { removeToken, setToken } from '@/services/AuthService';

interface LoginArgs {
  email: string;
  password: string;
}

export const login = createAsyncThunk<AuthResponse, LoginArgs, { rejectValue: string }>(
  'auth/login',
  async (dto, { rejectWithValue }) => {
    try {
      console.log('Начало async login:', dto);
      const { data } = await $api.post<AuthResponse>('auth/login', dto);
      console.log('Ответ от сервера:', data);
      setToken(data.accessToken);

      return data;
    } catch (error) {
      console.log('Начало блока catch. Ошибка:', error);
      return rejectWithValue(
        isAxiosError(error)
          ? (error.response?.data?.message ?? 'Ошибка авторизации')
          : 'Ошибка авторизации',
      );
    }
  },
);

export const registration = createAsyncThunk<AuthResponse, LoginArgs, { rejectValue: string }>(
  'auth/register',
  async (dto, { rejectWithValue }) => {
    try {
      const { data } = await $api.post<AuthResponse>('auth/register', dto);
      setToken(data.accessToken);

      return data;
    } catch (error) {
      return rejectWithValue(
        isAxiosError(error)
          ? (error.response?.data?.message ?? 'Ошибка авторизации')
          : 'Ошибка авторизации',
      );
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    const { data } = await $api.post<AuthResponse>('auth/logout');
    removeToken();

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data?.message);
    }
  }
});

export const checkAuth = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {
        withCredentials: true,
      });
      console.log(response);
      setToken(response.data.accessToken);

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }

      return rejectWithValue(
        isAxiosError(error)
          ? (error.response?.data?.message ?? 'Ошибка при разборе ответа ошибки')
          : 'Ошибка checkAuth',
      );
    }
  },
);
