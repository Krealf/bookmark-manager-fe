import styles from './CardMenu.module.scss';

import IconDots from '@/assets/icons/icon-menu-bookmark.svg?react';
import React, { useRef, useState } from 'react';

import IconEdit from '@/assets/icons/icon-edit.svg?react';
import IconArchived from '@/assets/icons/icon-archive.svg?react';
import IconUnarchived from '@/assets/icons/icon-unarchive.svg?react';
import IconCopy from '@/assets/icons/icon-copy.svg?react';
import IconUnpin from '@/assets/icons/icon-unpin.svg?react';
import IconPin from '@/assets/icons/icon-pin.svg?react';
import IconVisit from '@/assets/icons/icon-visit.svg?react';
import IconDelete from '@/assets/icons/icon-delete.svg?react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CardMenuItem, CardMenuIcon } from '@/types/dropdown';

const ACTION_ICON_MAP: Record<CardMenuIcon, React.ReactNode> = {
  visit: <IconVisit />,
  copy: <IconCopy />,
  pin: <IconPin />,
  unpin: <IconUnpin />,
  edit: <IconEdit />,
  archived: <IconArchived />,
  unarchived: <IconUnarchived />,
  delete: <IconDelete />,
};

interface CardMenuProps {
  actions: CardMenuItem[];
}

export const CardMenu = ({ actions }: CardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

  const handleCloseMenu = () => setIsOpen(false);

  const renderAction = (action: CardMenuItem) => {
    if (action.type === 'link') {
      return (
        <li className={styles.dropdownItem} key={action.label}>
          <a
            href={action.url}
            target="_blank"
            role="menuitem"
            className={styles.dropdownControl}
            rel="noreferrer"
            onClick={() => {
              action.onClick?.();
              handleCloseMenu();
            }}
          >
            {ACTION_ICON_MAP[action.iconName]}
            <span>{action.label}</span>
          </a>
        </li>
      );
    }

    return (
      <li className={styles.dropdownItem} key={action.label}>
        <button
          type="button"
          role="menuitem"
          className={styles.dropdownControl}
          onClick={() => {
            action.onClick();
            handleCloseMenu();
          }}
        >
          {ACTION_ICON_MAP[action.iconName]}
          <span>{action.label}</span>
        </button>
      </li>
    );
  };

  return (
    <div className={styles.menu}>
      <button
        className={`${styles.button} ${isOpen ? styles.active : ''}`}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open bookmark menu"
        onClick={() => setIsOpen((prevState) => !prevState)}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <IconDots />
      </button>

      {isOpen && (
        <ul ref={menuRef} className={styles.dropdown} role="menu">
          {actions.map((item) => renderAction(item))}
        </ul>
      )}
    </div>
  );
};
