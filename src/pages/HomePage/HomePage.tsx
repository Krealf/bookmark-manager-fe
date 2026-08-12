import styles from './HomePage.module.scss';
import { fetchAllBookmarks } from '@/features/Bookmarks/bookmarksActions';
import { useSelector } from 'react-redux';
import {
  selectBookmarksError,
  selectBookmarksStatus,
  selectFilteredBookmarks,
} from '@/features/Bookmarks/bookmarksSelectors';
import { Card } from '@/components/Card';
import { useAppDispatch } from '@/redux-hook';
import { useModal } from '@/hooks/useModal';
import { EditModal } from '@/components/EditModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Submenu } from '@/components/Submenu';
import { setCategory } from '@/features/Bookmarks/bookmarksSlice';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { SearchTitle } from '@/components/SearchTitle';
import { CardSkeleton } from '@/components/CardSkeleton';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const { filteredBookmarks, query, activeTags, activeCategory } =
    useSelector(selectFilteredBookmarks);
  const status = useSelector(selectBookmarksStatus);

  const { activeModal, openModal, closeModal } = useModal();
  const { handleUpdateBookmark, handleCopyLink } = useBookmarksActions();

  const error = useSelector(selectBookmarksError);

  useEffect(() => {
    if (status === 'idle' && !filteredBookmarks.length) {
      dispatch(fetchAllBookmarks());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const activeBookmarks = filteredBookmarks.filter((b) => !b.isArchived);

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
          {status === 'loading' &&
            filteredBookmarks.length === 0 &&
            Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}

          {activeBookmarks.map((bookmark) => (
            <Card
              bookmark={bookmark}
              menuItems={[
                {
                  type: 'link',
                  label: 'Visit',
                  iconName: 'visit',
                  link: bookmark.url,
                },
                {
                  type: 'action',
                  label: 'Copy URL',
                  iconName: 'copy',
                  link: bookmark.url,
                  onClick: () => handleCopyLink(bookmark.url),
                },
                {
                  type: 'action',
                  label: bookmark.pinned ? 'Unpin' : 'Pin',
                  iconName: bookmark.pinned ? 'unpin' : 'pin',
                  onClick: () => {
                    handleUpdateBookmark(
                      bookmark.id,
                      {
                        pinned: !bookmark.pinned,
                      },
                      {
                        successMessage: `Bookmark ${bookmark.pinned ? 'unpinned' : 'pinned to top'}.`,
                      },
                    );
                  },
                },
                {
                  type: 'action',
                  label: 'Edit',
                  iconName: 'edit',
                  onClick: () => openModal({ type: 'edit', bookmark, id: bookmark.id }),
                },
                {
                  type: 'action',
                  label: bookmark.isArchived ? 'Unarchive' : 'Archive',
                  iconName: bookmark.isArchived ? 'unarchived' : 'archived',
                  onClick: () =>
                    openModal({
                      type: 'confirm-archive',
                      bookmark,
                      id: bookmark.id,
                    }),
                },
              ]}
              key={bookmark.id}
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
          onSave={() =>
            handleUpdateBookmark(
              activeModal.bookmark.id,
              {
                isArchived: !activeModal.bookmark.isArchived,
              },
              {
                successMessage: 'Bookmark archived.',
              },
            )
          }
        />
      )}
    </>
  );
};
