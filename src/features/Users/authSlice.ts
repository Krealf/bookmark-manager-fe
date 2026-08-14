import { createSlice } from '@reduxjs/toolkit';
import { checkAuth, login, logout, registration } from '@/features/Users/authActions';
import { getToken } from '@/services/AuthService';

export type AuthSlice = {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthSlice = {
  user: null,
  isAuthenticated: false,
  isLoading: Boolean(getToken()),
  error: null,
};

const authSlice = createSlice({
  name: '@auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || null;
        state.isLoading = false;
      })
      .addCase(registration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(registration.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || null;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || null;
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || null;
      });
  },
});

export default authSlice.reducer;
