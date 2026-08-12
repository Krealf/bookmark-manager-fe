import styles from './UserMenu.module.scss';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

import avatarImage from '@/assets/icons/image-avatar.webp';
import IconTheme from '@/assets/icons/icon-theme.svg?react';
import IconLogout from '@/assets/icons/icon-logout.svg?react';
import { ToggleSwitch } from '@/components/ToggleSwitch';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const refMenu = useRef<HTMLUListElement>(null);
  useClickOutside(refMenu, () => setIsOpen(false));
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open bookmark menu"
        className={`${styles.button} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <img
          className={styles.avatar}
          src={avatarImage}
          alt="User Avatar"
          width="40"
          height="40"
          loading="lazy"
        />
      </button>

      {isOpen && (
        <ul ref={refMenu} className={styles.menu} role="menu">
          <li className={styles.profileHeader}>
            <img
              className={styles.avatar}
              src={avatarImage}
              alt="User Avatar"
              width="40"
              height="40"
              loading="lazy"
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>Emily Carter</div>
              <div className={styles.userEmail}>emily101@email.com</div>
            </div>
          </li>
          <li className={styles.menuItem} role="menuitem">
            <div className={styles.action}>
              <IconTheme className={styles.icon} />
              <div className={styles.label}>Theme</div>
            </div>
            <ToggleSwitch />
          </li>
          <li className={styles.menuItem} role="menuitem">
            <div className={styles.action}>
              <IconLogout className={styles.icon} />
              <div className={styles.label}>Logout</div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
