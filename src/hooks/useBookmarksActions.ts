import { useAppDispatch } from '@/redux-hook';
import {
  createBookmark,
  deleteBookmarkById,
  updateBookmarkById,
} from '@/features/Bookmarks/bookmarksActions';
import { toast } from 'sonner';
import { ReactNode, useCallback } from 'react';
import { Bookmark } from '@/types/bookmark';

export const useBookmarksActions = () => {
  const dispatch = useAppDispatch();

  const handleUpdateBookmark = useCallback(
    (
      id: Bookmark['id'],
      dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>,
      options: {
        successMessage?: string;
        icon?: ReactNode;
      } = {},
    ) => {
      const { successMessage = 'Bookmark updated' } = options;

      toast.promise(dispatch(updateBookmarkById({ id, dto })).unwrap(), {
        loading: 'Saving...',
        success: successMessage,
        error: (err) => err.message,
        closeButton: true,
      });
    },
    [dispatch],
  );

  const handleDeleteBookmark = useCallback(
    (
      id: Bookmark['id'],
      options: {
        successMessage?: string;
        icon?: ReactNode;
      },
    ) => {
      const { successMessage = 'Bookmark updated' } = options;

      toast.promise(dispatch(deleteBookmarkById(id)).unwrap(), {
        loading: 'Saving...',
        success: successMessage,
        error: (err) => err.message,
        closeButton: true,
      });
    },
    [dispatch],
  );

  const handleCopyLink = useCallback(async (linkToCopy: string) => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast.success('Link copied to clipboard.');
    } catch (err) {
      console.error('Ошибка при копировании: ', err);
    }
  }, []);

  const handleAddBookmark = useCallback(
    (
      dto: Required<Pick<Bookmark, 'title' | 'description' | 'websiteUrl' | 'tags'>>,
      options: {
        successMessage?: string;
        icon?: ReactNode;
      },
    ) => {
      const { successMessage = 'Bookmark updated' } = options;

      toast.promise(dispatch(createBookmark(dto)).unwrap(), {
        loading: 'Saving...',
        success: successMessage,
        error: (err) => err.message,
        closeButton: true,
      });
    },
    [dispatch],
  );

  return {
    handleUpdateBookmark,
    handleDeleteBookmark,
    handleCopyLink,
    handleAddBookmark,
  };
};
