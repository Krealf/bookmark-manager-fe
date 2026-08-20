import { createAsyncThunk } from '@reduxjs/toolkit';
import $api, { API_URL } from '@/utils/fetchApi';
import { AuthResponse } from '@/models/response/AuthResponse';
import axios from 'axios';
import { removeToken, setToken } from '@/services/AuthService';
import { ApiErrorPayload, extractApiError } from '@/utils/handleAxiosError';

interface LoginArgs {
  email: string;
  password: string;
}

interface RegisterArgs extends LoginArgs {
  fullName: string;
}

export const login = createAsyncThunk<AuthResponse, LoginArgs, { rejectValue: ApiErrorPayload }>(
  'auth/login',
  async (dto, { rejectWithValue }) => {
    try {
      const { data } = await $api.post<AuthResponse>('auth/login', dto);
      setToken(data.accessToken);

      return data;
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  },
);

export const registration = createAsyncThunk<
  AuthResponse,
  RegisterArgs,
  { rejectValue: ApiErrorPayload }
>('auth/register', async (dto, { rejectWithValue }) => {
  try {
    const { data } = await $api.post<AuthResponse>('auth/register', dto);
    setToken(data.accessToken);

    return data;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: ApiErrorPayload }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await $api.post<AuthResponse>('auth/logout');
      removeToken();
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  },
);

export const checkAuth = createAsyncThunk<AuthResponse, void, { rejectValue: ApiErrorPayload }>(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {
        withCredentials: true,
      });
      setToken(response.data.accessToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  },
);
