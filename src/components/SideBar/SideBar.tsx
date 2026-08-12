import styles from './SideBar.module.scss';
import { NavLink } from 'react-router';

import IconHome from '@/assets/icons/icon-home.svg?react';
import IconArchived from '@/assets/icons/icon-archive.svg?react';
import IconLightTheme from '@/assets/icons/logo-light-theme.svg';
import IconDarkTheme from '@/assets/icons/logo-dark-theme.svg';
import { useSelector } from 'react-redux';
import { selectTagsWithCount } from '@/features/Bookmarks/bookmarksSelectors';
import { Checkbox } from '@/components/Checkbox';
import { useAppDispatch } from '@/redux-hook';
import { toggleTag } from '@/features/Bookmarks/bookmarksSlice';

interface SideBarProps {
  isOpen: boolean;
  className: string;
  id: string;
}

export const SideBar = ({ isOpen, className, id }: SideBarProps) => {
  const tagsArray = useSelector(selectTagsWithCount);
  const dispatch = useAppDispatch();

  const handleToggleTag = (tagName: string) => {
    dispatch(toggleTag(tagName));
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
            {tagsArray.map(({ name, count }) => (
              <li className={styles.tagItem} key={name}>
                <label htmlFor={name.toLowerCase()} className={styles.tagLabel}>
                  <Checkbox
                    label={name}
                    id={name.toLowerCase()}
                    onChange={() => handleToggleTag(name)}
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
