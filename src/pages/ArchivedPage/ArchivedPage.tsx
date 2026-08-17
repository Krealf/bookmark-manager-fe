import styles from './ArchivedPage.module.scss';
import { useSelector } from 'react-redux';
import { selectFilteredBookmarks } from '@/features/Bookmarks/bookmarksSelectors';
import { useModal } from '@/hooks/useModal';
import { Card } from '@/components/Card';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { SearchTitle } from '@/components/SearchTitle';
import { setCategory } from '@/features/Bookmarks/bookmarksSlice';
import { Submenu } from '@/components/Submenu';
import { useAppDispatch, useAppSelector } from '@/redux-hook';
import { useCallback, useEffect } from 'react';
import { fetchAllBookmarks } from '@/features/Bookmarks/bookmarksActions';
import { getMenuItems } from '@/utils/getMenuItems';
import { toast } from 'sonner';
import { Bookmark } from '@/types/bookmark';

export const ArchivedPage = () => {
  const dispatch = useAppDispatch();

  const { filteredBookmarks, query, activeTags, activeCategory } =
    useSelector(selectFilteredBookmarks);
  const { activeModal, openModal, closeModal } = useModal();
  const { handleUpdateBookmark, handleDeleteBookmark } = useBookmarksActions();
  const { isFetched } = useAppSelector((state) => state.bookmarks);

  const activeBookmarks = filteredBookmarks.filter((b) => b.isArchived);

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchAllBookmarks());
    }
  }, [isFetched]);

  const handleCopyMenuClick = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    } catch (error) {
      console.error('Error while copying the link. Log:', error);
      toast.error('Failed to copy link.');
    }
  };

  const handleOpenArchiveConfirm = useCallback(
    async (bookmark: Bookmark) =>
      openModal({
        type: 'confirm-unarchive',
        bookmark: bookmark,
      }),
    [openModal],
  );

  const handleConfirmUnarchive = useCallback(async () => {
    if (activeModal && activeModal.type === 'confirm-unarchive') {
      const { id } = activeModal.bookmark;

      const updatePromise = handleUpdateBookmark(id, {
        isArchived: false,
      });

      toast.promise(updatePromise, {
        loading: 'Unarchiving...',
        success: 'Unarchive',
        error: 'Failed to unarchive bookmark.',
      });

      await updatePromise;
    }
  }, [activeModal, handleUpdateBookmark]);

  const handleConfirmDelete = useCallback(async () => {
    if (activeModal && activeModal.type === 'confirm-delete') {
      const { id } = activeModal.bookmark;

      const updatePromise = handleDeleteBookmark(id);

      toast.promise(updatePromise, {
        loading: 'Deletion......',
        success: 'The bookmark has been deleted.',
        error: 'The bookmark could not be deleted.',
      });

      await updatePromise;
    }
  }, [activeModal, handleDeleteBookmark]);

  const handleOpenDeleteConfirm = useCallback(
    async (bookmark: Bookmark) =>
      openModal({
        type: 'confirm-delete',
        bookmark,
      }),
    [openModal],
  );

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <SearchTitle query={query} tags={activeTags} defaultText="Archived bookmarks" />
          <Submenu
            label="Sort by"
            defaultOption={activeCategory}
            items={[
              {
                label: 'Recently added',
                id: 'recently_added',
                onClick: () => dispatch(setCategory('recently_added')),
              },
              {
                label: 'Recently visited',
                id: 'recently_visited',
                onClick: () => dispatch(setCategory('recently_visited')),
              },
              {
                label: 'Most visited',
                id: 'most_visited',
                onClick: () => dispatch(setCategory('most_visited')),
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          {activeBookmarks.map((bookmark) => (
            <Card
              bookmark={bookmark}
              key={bookmark.id}
              menuItems={getMenuItems(bookmark, {
                items: ['visit', 'copy', 'archive', 'delete'],
                callbacks: {
                  onCopy: handleCopyMenuClick,
                  onToggleArchive: handleOpenArchiveConfirm,
                  onDelete: handleOpenDeleteConfirm,
                },
              })}
            />
          ))}
        </div>
      </section>

      {activeModal?.type === 'confirm-unarchive' && (
        <ConfirmModal
          title="Unarchive bookmark"
          description="Move this bookmark back to your active list?"
          confirmLabel="Unarchive"
          onClose={closeModal}
          onConfirm={handleConfirmUnarchive}
        />
      )}

      {activeModal?.type === 'confirm-delete' && (
        <ConfirmModal
          title="Delete bookmark"
          description="Are you sure you want to delete this bookmark?"
          confirmLabel="Delete Permanently"
          danger={true}
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};
