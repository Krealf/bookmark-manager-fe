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
import { DropdownItem, iconName } from '@/types/dropdown';

const iconMap: Record<iconName, React.ReactNode> = {
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
  items: DropdownItem[];
}

export const CardMenu = ({ items }: CardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const refMenu = useRef<HTMLUListElement>(null);
  useClickOutside(refMenu, () => setIsOpen(false));

  const renderItem = (item: DropdownItem) => {
    if (item.type === 'link') {
      return (
        <li className={styles.dropdownItem} key={item.label}>
          <a
            href={item.link}
            target="_blank"
            role="menuitem"
            className={styles.dropdownControl}
            rel="noreferrer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {iconMap[item.iconName]}
            <span>{item.label}</span>
          </a>
        </li>
      );
    }

    return (
      <li className={styles.dropdownItem} key={item.label}>
        <button
          type="button"
          role="menuitem"
          className={styles.dropdownControl}
          onClick={() => {
            item.onClick();
            setIsOpen(!isOpen);
          }}
        >
          {iconMap[item.iconName]}
          <span>{item.label}</span>
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
        <ul ref={refMenu} className={styles.dropdown} role="menu">
          {items.map((item) => renderItem(item))}
        </ul>
      )}
    </div>
  );
};
