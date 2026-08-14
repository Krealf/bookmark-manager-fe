import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectAllBookmarks = (state: RootState) => state.bookmarks.list;

export const selectBookmarksError = (state: RootState) => state.bookmarks.error;

export const selectQuerySearch = (state: RootState) => state.bookmarks.query;

export const selectCategorySearch = (state: RootState) => state.bookmarks.category;

export const selectAllSelectedTags = (state: RootState) => state.bookmarks.selectedTags;

export const selectFilteredBookmarks = createSelector(
  [selectAllBookmarks, selectAllSelectedTags, selectQuerySearch, selectCategorySearch],
  (allBookmarks, activeTags, query, activeCategory) => {
    const filteredBookmarks = allBookmarks.filter(
      (bookmark) =>
        activeTags.every((tag) => bookmark.tags.includes(tag)) &&
        bookmark.title.toLowerCase().includes(query.toLowerCase()),
    );

    filteredBookmarks.sort((a, b) => {
      const pinDeff = Number(b.pinned) - Number(a.pinned);

      if (pinDeff !== 0) {
        return pinDeff;
      }

      if (activeCategory === 'recently_added') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (activeCategory === 'recently_visited') {
        return new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime();
      } else if (activeCategory === 'most_visited') {
        return b.visitCount - a.visitCount;
      }

      return 0;
    });

    return { filteredBookmarks, query, activeTags, activeCategory };
  },
);

export const selectTagsWithCount = createSelector([selectAllBookmarks], (bookmarks) => {
  const tagsCount = bookmarks.reduce(
    (accumulator, currentValue) => {
      currentValue.tags.forEach((tag) => {
        accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      });

      return accumulator;
    },
    {} as Record<string, number>,
  );

  const tagsArray = Object.entries(tagsCount).map(([name, count]) => ({
    name,
    count,
  }));

  return tagsArray.sort((a, b) => a.name.localeCompare(b.name));
});
