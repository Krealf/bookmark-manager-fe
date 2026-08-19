import styles from './Layout.module.scss';

import IconMenuHamburger from '@/assets/icons/icon-menu-hamburger.svg?react';
import IconPlus from '@/assets/icons/icon-add.svg?react';
import IconSearch from '@/assets/icons/icon-search.svg?react';

import { Button } from '@/components/Button';
import { Outlet } from 'react-router';
import { useSidebarOpen } from '@/hooks/useSidebarOpen';
import { SideBar } from '@/components/SideBar';
import { SearchField } from '@/components/SearchField';
import { UserMenu } from '@/components/UserMenu';
import { useModal } from '@/hooks/useModal';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { Toaster } from 'sonner';
import { useCallback } from 'react';
import { FormModal } from '@/components/FormModal';

export const Layout = () => {
  const { isOpen, closeSidebar, toggleSidebar } = useSidebarOpen();
  const { activeModal, openModal, closeModal } = useModal();
  const { handleAddBookmark } = useBookmarksActions();

  const handleOpenAddModal = useCallback(() => {
    openModal({ type: 'add' });
  }, [openModal]);

  const handleCloseSidebar = () => {
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    if (isMobile()) {
      closeSidebar();
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.controls}>
          <button
            className={`${styles.burgerButton} visible-mobile`}
            aria-expanded={isOpen}
            aria-controls="sidebar"
            aria-label="Open menu"
            type="button"
            onClick={toggleSidebar}
          >
            <IconMenuHamburger />
          </button>
          <div className={styles.searchWrapper}>
            <SearchField placeholder="Search by title..." icon={IconSearch} />
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="md"
            icon={IconPlus}
            className={styles.addBookmark}
            onClick={handleOpenAddModal}
          >
            Add Bookmark
          </Button>
          <UserMenu />
        </div>
      </header>

      <button
        type="button"
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={closeSidebar}
        aria-label="Close menu"
      />

      <SideBar
        className={styles.sidebar}
        id="sidebar"
        isOpen={isOpen}
        onClose={handleCloseSidebar}
      />

      <main className={styles.main}>
        <Outlet />

        {activeModal?.type === 'add' && (
          <FormModal onClose={closeModal} onSubmit={handleAddBookmark} />
        )}
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface-inverse-search)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 6px 9px 0 rgba(21, 21, 21, 0.08)',
            userSelect: 'none',
          },
        }}
      />
    </div>
  );
};
