import styles from './Submenu.module.scss';
import { useCallback, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { SubmenuItem } from '@my-app/shared';
import { Button } from '@/components/Button';

import IconSort from '@/assets/icons/icon-sort.svg?react';
import IconCheck from '@/assets/icons/icon-check.svg?react';

interface SubmenuProps {
  label: string;
  items: SubmenuItem[];
  defaultOption: string;
}

export const Submenu = ({ label, items, defaultOption }: SubmenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(defaultOption);
  const refMenu = useRef<HTMLUListElement>(null);
  useClickOutside(refMenu, () => setIsOpen(false));

  const handleOpenMenu = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return (
    <div className={styles.menu}>
      <Button
        variant="secondary"
        size="sm"
        icon={IconSort}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open bookmark menu"
        className={isOpen ? styles.active : ''}
        onClick={handleOpenMenu}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {label}
      </Button>

      {isOpen && (
        <ul ref={refMenu} className={styles.dropdown} role="menu">
          {items.map(({ id, label, onClick }) => (
            <li role="none" key={id}>
              <button
                role="menuitem"
                type="button"
                className={`${styles.dropdownControl} ${selectedItem === id ? styles.selected : ''}`}
                onClick={() => {
                  onClick();
                  setIsOpen(false);
                  setSelectedItem(id);
                }}
              >
                <span>{label}</span>
                {selectedItem === id && <IconCheck />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
