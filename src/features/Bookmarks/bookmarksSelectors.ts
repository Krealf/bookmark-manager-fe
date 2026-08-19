import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';
import { TagWithCount, UserTag } from '@/types/tags';

export const selectContextBookmarks = createSelector(
  [
    (state: RootState) => state.bookmarks.list,
    (state: RootState) => state.bookmarks.query,
    (_: RootState, isArchived: boolean) => isArchived,
  ],
  (list, query, isArchived) => {
    let result = list.filter((b) => (isArchived ? b.isArchived : !b.isArchived));

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.websiteUrl.toLowerCase().includes(q),
      );
    }

    return result;
  },
);

export const selectSidebarTags = createSelector(
  [selectContextBookmarks],
  (contextBookmarks): TagWithCount[] => {
    const tagMap = new Map<string, TagWithCount>();

    contextBookmarks.forEach((bookmark) => {
      bookmark.tags?.forEach((rawTag) => {
        const trimmed = rawTag.trim();
        if (!trimmed) return;

        const key = trimmed.toLowerCase();

        if (!tagMap.has(key)) {
          tagMap.set(key, {
            key,
            name: trimmed,
            count: 0,
          });
        }

        const tagData = tagMap.get(key)!;
        tagData.count += 1;
      });
    });

    return Array.from(tagMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  },
);

export const selectAllTags = createSelector(
  [(state: RootState) => state.bookmarks.list],
  (bookmarks): UserTag[] => {
    const tagMap = new Map<string, UserTag>();

    bookmarks.forEach((bookmark) => {
      bookmark.tags?.forEach((rawTag) => {
        const trimmed = rawTag.trim();
        if (!trimmed) return;

        const key = trimmed.toLowerCase();

        if (!tagMap.has(key)) {
          tagMap.set(key, {
            key,
            name: trimmed,
          });
        }
      });
    });

    return Array.from(tagMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  },
);

export const selectFilteredBookmarks = createSelector(
  [
    selectContextBookmarks,
    (state: RootState) => state.bookmarks.selectedTags,
    (state: RootState) => state.bookmarks.category,
  ],
  (contextBookmarks, selectedTags, category) => {
    let result = contextBookmarks;

    if (selectedTags.length > 0) {
      result = result.filter((bookmark) => {
        const bookmarkTagsLower = (bookmark.tags || []).map((t) => t.trim());

        return selectedTags.every((selTag) => bookmarkTagsLower.includes(selTag));
      });
    }

    result = [...result].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return b.pinned ? 1 : -1;
      }

      if (category === 'recently_visited') {
        return new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime();
      }

      if (category === 'most_visited') {
        return (b.visitCount || 0) - (a.visitCount || 0);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  },
);
