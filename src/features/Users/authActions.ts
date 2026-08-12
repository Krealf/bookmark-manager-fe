import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSlice } from '@/features/Users/authSlice';

export const fetchMe = createAsyncThunk<
  AuthSlice["user"]
>("auth/fetchMe", async () => {
  const res = await fetch("/api/auth/me", {
    credentials: "include"
  })

  if (!res.ok) throw new Error("Unauthenticated")

  return res.json()
})