import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectAllBookmarks = (state: RootState) => state.bookmarks.list;

export const selectQuerySearch = (state: RootState) => state.bookmarks.query;

export const selectCategorySearch = (state: RootState) => state.bookmarks.category;

export const selectAllSelectedTags = (state: RootState) => state.bookmarks.selectedTags;

export const selectFilteredBookmarks = createSelector(
  [selectAllBookmarks, selectAllSelectedTags, selectQuerySearch, selectCategorySearch],
  (allBookmarks, selectedTags, query, category) => {
    let result = allBookmarks;

    if (selectedTags.length > 0) {
      result = result.filter((bookmark) => {
        const bookmarkTagsLower = (bookmark.tags || []).map((t) => t.trim());

        return selectedTags.every((selTag) => bookmarkTagsLower.includes(selTag));
      });
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.websiteUrl.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      if (category === 'recently_visited') {
        return new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime();
      }

      if (category === 'most_visited') {
        return (b.visitCount || 0) - (a.visitCount || 0);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      filteredBookmarks: result,
      query,
      activeTags: selectedTags,
      activeCategory: category,
    };
  },
);

export const selectTagsWithCount = createSelector([selectAllBookmarks], (bookmarks) => {
  const tagMap = bookmarks.reduce(
    (accumulator, currentValue) => {
      currentValue.tags?.forEach((rawTag) => {
        const cleanTag = rawTag.trim();

        accumulator[cleanTag] = (accumulator[cleanTag] ?? 0) + 1;
      });

      return accumulator;
    },
    {} as Record<string, number>,
  );

  return Object.entries(tagMap).sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }),
  );
});
