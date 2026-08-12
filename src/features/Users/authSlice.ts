import { createSlice } from '@reduxjs/toolkit';
import { fetchMe } from '@/features/Users/authActions';

export type AuthSlice = {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
  } | null;
  status: 'idle' | 'loading' | 'success' | 'unauthenticated';
};

const initialState: AuthSlice = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: '@auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      });
  },
});

export default authSlice.reducer;