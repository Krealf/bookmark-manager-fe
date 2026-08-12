import styles from './ArchivedPage.module.scss';
import { useSelector } from 'react-redux';
import {
  selectBookmarksStatus,
  selectFilteredBookmarks,
} from '@/features/Bookmarks/bookmarksSelectors';
import { useModal } from '@/hooks/useModal';
import { Card } from '@/components/Card';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { SearchTitle } from '@/components/SearchTitle';
import { setCategory } from '@/features/Bookmarks/bookmarksSlice';
import { Submenu } from '@/components/Submenu';
import { useAppDispatch } from '@/redux-hook';
import { useEffect } from 'react';
import { fetchAllBookmarks } from '@/features/Bookmarks/bookmarksActions';

export const ArchivedPage = () => {
  const dispatch = useAppDispatch();

  const status = useSelector(selectBookmarksStatus);
  const { filteredBookmarks, query, activeTags, activeCategory } =
    useSelector(selectFilteredBookmarks);
  const { activeModal, openModal, closeModal } = useModal();
  const { handleDeleteBookmark, handleUpdateBookmark, handleCopyLink } = useBookmarksActions();

  const activeBookmarks = filteredBookmarks.filter((b) => b.isArchived);

  useEffect(() => {
    if (status === 'idle' && !filteredBookmarks.length) {
      dispatch(fetchAllBookmarks());
    }
  }, [dispatch]);

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
                  onClick: () => handleCopyLink('Click to copy'),
                },
                {
                  type: 'action',
                  label: bookmark.isArchived ? 'Unarchive' : 'Archive',
                  iconName: bookmark.isArchived ? 'unarchived' : 'archived',
                  onClick: () =>
                    openModal({
                      type: 'confirm-unarchive',
                      bookmark,
                      id: bookmark.id,
                    }),
                },
                {
                  type: 'action',
                  label: 'Delete Permanently',
                  iconName: 'delete',
                  onClick: () =>
                    openModal({
                      type: 'confirm-delete',
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

      {activeModal?.type === 'confirm-unarchive' && (
        <ConfirmModal
          title="Unarchive bookmark"
          description="Move this bookmark back to your active list?"
          confirmLabel="Unarchive"
          onClose={closeModal}
          onSave={() =>
            handleUpdateBookmark(
              activeModal.bookmark.id,
              {
                isArchived: !activeModal.bookmark.isArchived,
              },
              {
                successMessage: 'Bookmark unarchived.',
              },
            )
          }
        />
      )}

      {activeModal?.type === 'confirm-delete' && (
        <ConfirmModal
          title="Delete bookmark"
          description="Are you sure you want to delete this bookmark?"
          confirmLabel="Delete Permanently"
          danger={true}
          onClose={closeModal}
          onSave={() =>
            handleDeleteBookmark(activeModal.bookmark.id, {
              successMessage: 'Bookmark deleted.',
            })
          }
        />
      )}
    </>
  );
};
