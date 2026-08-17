import styles from './SideBar.module.scss';
import { NavLink } from 'react-router';

import IconHome from '@/assets/icons/icon-home.svg?react';
import IconArchived from '@/assets/icons/icon-archive.svg?react';
import IconLightTheme from '@/assets/icons/logo-light-theme.svg';
import IconDarkTheme from '@/assets/icons/logo-dark-theme.svg';
import { useSelector } from 'react-redux';
import {
  selectAllSelectedTags,
  selectTagsWithCount,
} from '@/features/Bookmarks/bookmarksSelectors';
import { Checkbox } from '@/components/Checkbox';
import { useAppDispatch } from '@/redux-hook';
import { toggleTag } from '@/features/Bookmarks/bookmarksSlice';

interface SideBarProps {
  isOpen: boolean;
  className: string;
  id: string;
  onClose: () => void;
}

export const SideBar = ({ isOpen, className, id, onClose }: SideBarProps) => {
  const tagsArray = useSelector(selectTagsWithCount);
  const selectedTags = useSelector(selectAllSelectedTags);
  const dispatch = useAppDispatch();

  const handleToggleTag = (tagKey: string) => {
    dispatch(toggleTag(tagKey));
  };

  return (
    <aside
      className={`${styles.sidebar} ${className ?? ''} ${isOpen ? styles.open : ''}`}
      id={id}
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
    >
      <header className={styles.header}>
        <a href="/" className={styles.headerLogo} aria-label="Homepage bookmark-manager">
          <img
            src={IconLightTheme}
            alt=""
            loading="lazy"
            className={styles.logoLight}
            aria-hidden={true}
          />
          <img
            src={IconDarkTheme}
            alt=""
            loading="lazy"
            className={styles.logoDark}
            aria-hidden={true}
          />
        </a>
      </header>
      <div className={styles.body}>
        <nav className={styles.panels} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                onClick={onClose}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                to="/"
                end
              >
                <IconHome />
                Home
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                onClick={onClose}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                to="/archived"
              >
                <IconArchived />
                Archived
              </NavLink>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="tags-title" className={styles.section}>
          <h2 id="tags-title" className={styles.sectionTitle}>
            Tags
          </h2>
          <ul className={styles.tagList}>
            {tagsArray.map(([tag, count]) => (
              <li className={styles.tagItem} key={tag}>
                <label htmlFor={`tag-${tag}`} className={styles.tagLabel}>
                  <Checkbox
                    label={tag}
                    checked={selectedTags.includes(tag)}
                    id={`tag-${tag}`}
                    onChange={() => handleToggleTag(tag)}
                  />
                  <span className={styles.tagQuantity}>{count}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
};
