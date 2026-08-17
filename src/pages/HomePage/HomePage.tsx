import styles from './HomePage.module.scss';
import { fetchAllBookmarks } from '@/features/Bookmarks/bookmarksActions';
import { useSelector } from 'react-redux';
import { selectFilteredBookmarks } from '@/features/Bookmarks/bookmarksSelectors';
import { Card } from '@/components/Card';
import { useAppDispatch, useAppSelector } from '@/redux-hook';
import { useModal } from '@/hooks/useModal';
import { EditModal } from '@/components/EditModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Submenu } from '@/components/Submenu';
import { setCategory } from '@/features/Bookmarks/bookmarksSlice';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { SearchTitle } from '@/components/SearchTitle';
import { CardSkeleton } from '@/components/CardSkeleton';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getMenuItems } from '@/utils/getMenuItems';
import { Bookmark } from '@/types/bookmark';

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const { filteredBookmarks, query, activeTags, activeCategory } =
    useSelector(selectFilteredBookmarks);
  const { isFetched } = useAppSelector((state) => state.bookmarks);

  const { activeModal, closeModal, openModal } = useModal();
  const { handleUpdateBookmark, handleVisitBookmark } = useBookmarksActions();

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchAllBookmarks());
    }
  }, [isFetched]);

  const activeBookmarks = filteredBookmarks.filter((b) => !b.isArchived);

  const handleVisitMenuClick = useCallback(
    async (bookmarkId: Bookmark['id']) => {
      const updatePromise = handleVisitBookmark(bookmarkId);

      toast.promise(updatePromise, {
        loading: 'Update......',
        success: 'Updated.',
        error: 'Failed to update bookmark.',
      });

      await updatePromise;
    },
    [handleUpdateBookmark],
  );

  const handleCopyMenuClick = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    } catch (error) {
      console.log('Ошибка при копировании ссылки', error);
      toast.error('Failed to copy link.');
    }
  };

  const handlePinMenuClick = useCallback(
    async (bookmarkId: Bookmark['id'], isPinned: boolean) => {
      const updatePromise = handleUpdateBookmark(bookmarkId, {
        pinned: !isPinned,
      });

      toast.promise(updatePromise, {
        loading: isPinned ? 'Unpinning...' : 'Pinning to top...',
        success: isPinned ? 'Unpinned.' : 'Pinned to top',
        error: 'Failed to update bookmark.',
      });

      await updatePromise;
    },
    [handleUpdateBookmark],
  );

  const handleOpenArchiveConfirm = useCallback(
    async (bookmark: Bookmark) =>
      openModal({
        type: 'confirm-archive',
        bookmark: bookmark,
      }),
    [openModal],
  );

  const handleConfirmArchive = useCallback(async () => {
    if (activeModal && activeModal.type === 'confirm-archive') {
      const { id } = activeModal.bookmark;

      const updatePromise = handleUpdateBookmark(id, {
        isArchived: true,
      });

      toast.promise(updatePromise, {
        loading: 'Archiving...',
        success: 'Archive.',
        error: 'Failed to archive bookmark.',
      });

      await updatePromise;
    }
  }, [activeModal, handleUpdateBookmark]);

  const handleOpenEditConfirm = useCallback(
    async (bookmark: Bookmark) =>
      openModal({
        type: 'edit',
        bookmark: bookmark,
      }),
    [openModal],
  );

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <SearchTitle query={query} tags={activeTags} defaultText="All bookmarks" />
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
          {!isFetched &&
            filteredBookmarks.length === 0 &&
            Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}

          {activeBookmarks.map((bookmark) => (
            <Card
              bookmark={bookmark}
              key={bookmark.id}
              menuItems={getMenuItems(bookmark, {
                items: ['visit', 'copy', 'pin', 'edit', 'archive'],
                callbacks: {
                  onVisit: handleVisitMenuClick,
                  onCopy: handleCopyMenuClick,
                  onPin: handlePinMenuClick,
                  onToggleArchive: handleOpenArchiveConfirm,
                  onEdit: handleOpenEditConfirm,
                },
              })}
            />
          ))}
        </div>
      </section>

      {activeModal?.type === 'edit' && (
        <EditModal
          title="Edit bookmark"
          description="Update your saved link details — change the title, description, URL, or tags anytime."
          confirmLabel="Save Bookmark"
          bookmark={activeModal.bookmark}
          onClose={closeModal}
          onSave={handleUpdateBookmark}
        />
      )}

      {activeModal?.type === 'confirm-archive' && (
        <ConfirmModal
          title="Archive bookmark"
          description="Are you sure you want to archive this bookmark?"
          confirmLabel="Archive"
          onClose={closeModal}
          onConfirm={handleConfirmArchive}
        />
      )}
    </>
  );
};
