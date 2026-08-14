import type { Bookmark } from '@/types/bookmark';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createBookmark,
  deleteBookmarkById,
  fetchAllBookmarks,
  updateBookmarkById,
} from '@/features/Bookmarks/bookmarksActions';

export type bookmarksSlice = {
  isLoading: boolean;
  list: Bookmark[];
  previousList: Bookmark[] | null;
  selectedTags: string[];
  error: string | null;
  query: string;
  category: 'recently_added' | 'recently_visited' | 'most_visited';
};

const initialState: bookmarksSlice = {
  isLoading: true,
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllBookmarks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || null;
      })
      .addCase(updateBookmarkById.pending, (state, action) => {
        state.previousList = Array.from(state.list);
        const { id, dto } = action.meta.arg;

        const index = state.list.findIndex((item) => item.id === id);

        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...dto };
        }

        state.isLoading = true;
      })
      .addCase(updateBookmarkById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex((item) => item.id === action.payload.id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBookmarkById.rejected, (state, action) => {
        state.list = state.previousList ?? state.list;
        state.isLoading = false;
        state.error = action.payload?.message || null;
      })
      .addCase(deleteBookmarkById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookmarkById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBookmarkById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || null;
      })
      .addCase(createBookmark.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(createBookmark.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || null;
      });
  },
});

export const { toggleTag, setSearchQuery, setCategory } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
