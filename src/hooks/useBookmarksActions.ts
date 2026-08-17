import { useAppDispatch } from '@/redux-hook';
import {
  createBookmark,
  deleteBookmarkById,
  updateBookmarkById,
  visitBookmarkById,
} from '@/features/Bookmarks/bookmarksActions';
import { useCallback } from 'react';
import { Bookmark } from '@/types/bookmark';

export const useBookmarksActions = () => {
  const dispatch = useAppDispatch();

  const handleUpdateBookmark = useCallback(
    async (id: Bookmark['id'], dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>) => {
      return dispatch(updateBookmarkById({ id, dto })).unwrap();
    },
    [dispatch],
  );

  const handleVisitBookmark = useCallback(
    async (id: Bookmark['id']) => {
      return dispatch(visitBookmarkById(id)).unwrap();
    },
    [dispatch],
  );

  const handleDeleteBookmark = useCallback(
    async (id: Bookmark['id']) => {
      return dispatch(deleteBookmarkById(id)).unwrap();
    },
    [dispatch],
  );

  const handleAddBookmark = useCallback(
    async (dto: Required<Pick<Bookmark, 'title' | 'description' | 'websiteUrl' | 'tags'>>) => {
      return dispatch(createBookmark(dto)).unwrap();
    },
    [dispatch],
  );

  return {
    handleUpdateBookmark,
    handleDeleteBookmark,
    handleAddBookmark,
    handleVisitBookmark,
  };
};
