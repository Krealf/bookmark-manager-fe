import type { Bookmark } from '@/types/bookmark';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createBookmark,
  deleteBookmarkById,
  fetchAllBookmarks,
  updateBookmarkById,
} from '@/features/Bookmarks/bookmarksActions';

export type bookmarksSlice = {
  status: 'idle' | 'loading' | 'error';
  list: Bookmark[];
  previousList: Bookmark[] | null;
  selectedTags: string[];
  error: string | null;
  query: string;
  category: 'recently_added' | 'recently_visited' | 'most_visited';
};

const initialState: bookmarksSlice = {
  status: 'idle',
  list: [],
  previousList: null,
  selectedTags: [],
  error: null,
  query: '',
  category: 'recently_added',
};

const bookmarksSlice = createSlice({
  name: '@bookmarks',
  initialState,
  reducers: {
    toggleTag(state, action: PayloadAction<string>) {
      const tag = action.payload;

      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter((item) => item !== tag);
      } else {
        state.selectedTags.push(tag);
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state, action: PayloadAction<bookmarksSlice['category']>) {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookmarks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchAllBookmarks.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load bookmarks';
      })
      .addCase(updateBookmarkById.pending, (state, action) => {
        state.previousList = Array.from(state.list);
        const { id, dto } = action.meta.arg;

        const index = state.list.findIndex((item) => item.id === id);

        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...dto };
        }

        state.status = 'loading';
      })
      .addCase(updateBookmarkById.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.list.findIndex((item) => item.id === action.payload.id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBookmarkById.rejected, (state) => {
        state.list = state.previousList ?? state.list;
        state.status = 'error';
      })
      .addCase(deleteBookmarkById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBookmarkById.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(createBookmark.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list.push(action.payload);
      });
  },
});

export const { toggleTag, setSearchQuery, setCategory } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
