import { combineReducers, configureStore } from '@reduxjs/toolkit';

import bookmarkReducer from '@/features/Bookmarks/bookmarksSlice';
import authReducer from '@/features/Users/authSlice';

const rootReducer = combineReducers({
  bookmarks: bookmarkReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
