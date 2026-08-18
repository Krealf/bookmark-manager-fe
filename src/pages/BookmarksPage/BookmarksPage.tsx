import styles from './BookmarksPage.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux-hook';
import { useSelector } from 'react-redux';
import { selectFilteredBookmarks } from '@/features/Bookmarks/bookmarksSelectors';
import { useModal } from '@/hooks/useModal';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { useCallback, useEffect, useMemo } from 'react';
import { fetchAllBookmarks } from '@/features/Bookmarks/bookmarksActions';
import { Bookmark } from '@/types/bookmark';
import { toast } from 'sonner';
import { SearchQuery } from '@/components/SearchQuery';
import { SortSelect } from '@/components/SortSelect';
import { setCategory } from '@/features/Bookmarks/bookmarksSlice';
import { CardSkeleton } from '@/components/CardSkeleton';
import { Card } from '@/components/Card';
import { getMenuItems } from '@/utils/getMenuItems';
import { EditModal } from '@/components/EditModal';
import { ConfirmModal } from '@/components/ConfirmModal';

interface BookmarksPageProps {
  isArchived?: boolean;
}

export const BookmarksPage = ({ isArchived }: BookmarksPageProps) => {
  const dispatch = useAppDispatch();

  const { filteredBookmarks, query, activeTags } = useSelector(selectFilteredBookmarks);
  const { isFetched } = useAppSelector((state) => state.bookmarks);

  const { activeModal, closeModal, openModal } = useModal();
  const { handleUpdateBookmark, handleVisitBookmark, handleDeleteBookmark } = useBookmarksActions();

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchAllBookmarks());
    }
  }, [isFetched]);

  const displayedBookmarks = useMemo(
    () => filteredBookmarks.filter((b) => (isArchived ? b.isArchived : !b.isArchived)),
    [filteredBookmarks, isArchived],
  );

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
    [activeModal, handleVisitBookmark, closeModal],
  );

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    } catch (error) {
      console.error('Error while copying the link:', error);
      toast.error('Failed to copy link.');
    }
  };

  const handleTogglePin = useCallback(
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
    [activeModal, handleDeleteBookmark, closeModal],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (activeModal?.type === 'confirm-delete') {
      const { id } = activeModal.bookmark;
      const updatePromise = handleDeleteBookmark(id);

      toast.promise(updatePromise, {
        loading: 'Deleting...',
        success: 'Deleted.',
        error: 'The bookmark could not be deleted.',
      });

      await updatePromise;
    }
  }, [activeModal, handleDeleteBookmark, closeModal]);

  const handleToggleArchiveStatus = useCallback(async () => {
    if (
      !activeModal ||
      (activeModal.type !== 'confirm-archive' && activeModal.type !== 'confirm-unarchive')
    ) {
      return;
    }

    const { id } = activeModal.bookmark;
    const nextArchiveStatus = activeModal.type === 'confirm-archive';

    const updatePromise = handleUpdateBookmark(id, {
      isArchived: nextArchiveStatus,
    });

    toast.promise(updatePromise, {
      loading: nextArchiveStatus ? 'Archiving...' : 'Unarchiving...',
      success: nextArchiveStatus ? 'Archived.' : 'Unarchived.',
      error: 'Failed to archive bookmark.',
    });

    await updatePromise;
  }, [activeModal, handleDeleteBookmark, closeModal]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <SearchQuery
            query={query}
            tags={activeTags}
            defaultText={isArchived ? 'Archived bookmarks' : 'All bookmarks'}
          />
          <SortSelect
            label="Sort by"
            options={[
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

          {displayedBookmarks.map((bookmark) => (
            <Card
              bookmark={bookmark}
              key={bookmark.id}
              menuActions={getMenuItems(bookmark, {
                types: isArchived
                  ? ['visit', 'copy', 'archive', 'delete']
                  : ['visit', 'copy', 'pin', 'edit', 'archive'],
                callbacks: {
                  onVisit: handleVisitMenuClick,
                  onCopy: handleCopyUrl,
                  onPin: handleTogglePin,
                  onToggleArchive: (b) =>
                    openModal({
                      type: isArchived ? 'confirm-unarchive' : 'confirm-archive',
                      bookmark: b,
                    }),
                  onEdit: (b) => openModal({ type: 'edit', bookmark: b }),
                  onDelete: (b) => openModal({ type: 'confirm-delete', bookmark: b }),
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
          onConfirm={handleToggleArchiveStatus}
        />
      )}

      {activeModal?.type === 'confirm-unarchive' && (
        <ConfirmModal
          title="Unarchive bookmark"
          description="Move this bookmark back to your active list?"
          confirmLabel="Unarchive"
          onClose={closeModal}
          onConfirm={handleToggleArchiveStatus}
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
