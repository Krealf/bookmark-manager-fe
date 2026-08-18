import type { Bookmark } from '@/types/bookmark';
import { createSlice, current, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import {
  createBookmark,
  deleteBookmarkById,
  fetchAllBookmarks,
  updateBookmarkById,
  visitBookmarkById,
} from '@/features/Bookmarks/bookmarksActions';

export type bookmarksSlice = {
  isFetched: boolean;
  list: Bookmark[];
  previousItems: Record<string, Bookmark>;
  selectedTags: string[];
  error: string | null;
  query: string;
  category: 'recently_added' | 'recently_visited' | 'most_visited';
};

const initialState: bookmarksSlice = {
  isFetched: false,
  list: [],
  previousItems: {},
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
      const normalizedTag = action.payload.trim();

      if (state.selectedTags.includes(normalizedTag)) {
        state.selectedTags = state.selectedTags.filter((t) => t !== normalizedTag);
      } else {
        state.selectedTags.push(normalizedTag);
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

      // Fetch
      .addCase(fetchAllBookmarks.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
        state.isFetched = true;
        state.list = action.payload;
      })
      .addCase(fetchAllBookmarks.rejected, (state, action) => {
        state.isFetched = false;
        state.error = action.payload?.message || null;
      })

      // Create
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createBookmark.rejected, (state, action) => {
        state.error = action.payload?.message || null;
      })

      // Delete
      .addCase(deleteBookmarkById.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBookmarkById.rejected, (state, action) => {
        state.error = action.payload?.message || null;
      })

      // Optimistic update for updating the bookmark
      .addCase(updateBookmarkById.pending, (state, action) => {
        const { id, dto } = action.meta.arg;
        const index = state.list.findIndex((item) => item.id === id);

        if (index !== -1) {
          state.previousItems[id] = { ...current(state.list[index]) };

          state.list[index] = {
            ...state.list[index],
            ...dto,
          };
        }
      })

      // Optimistic update for the bookmark visit
      .addCase(visitBookmarkById.pending, (state, action) => {
        const id = action.meta.arg;
        const index = state.list.findIndex((item) => item.id === id);

        if (index !== -1) {
          state.previousItems[id] = { ...current(state.list[index]) };

          state.list[index].visitCount = (state.list[index].visitCount || 0) + 1;
          state.list[index].visitedAt = new Date().toISOString();
        }
      })

      .addMatcher(
        isAnyOf(updateBookmarkById.fulfilled, visitBookmarkById.fulfilled),
        (state, action) => {
          delete state.previousItems[action.payload.id];

          const index = state.list.findIndex((item) => item.id === action.payload.id);

          if (index !== -1) {
            state.list[index] = action.payload;
          }
        },
      )
      .addMatcher(
        isAnyOf(updateBookmarkById.rejected, visitBookmarkById.rejected),
        (state, action) => {
          const id = typeof action.meta.arg === 'object' ? action.meta.arg.id : action.meta.arg;

          const prevBookmark = state.previousItems[id];

          if (prevBookmark) {
            const index = state.list.findIndex((item) => item.id === id);

            if (index !== -1) {
              state.list[index] = prevBookmark;
            }
            delete state.previousItems[id];
          }

          state.error = action.payload?.message || null;
        },
      );
  },
});

export const { toggleTag, setSearchQuery, setCategory } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
