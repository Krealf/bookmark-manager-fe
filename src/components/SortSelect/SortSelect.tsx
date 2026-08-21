import styles from './SortSelect.module.scss';
import { useCallback, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Button } from '@/components/Button';

import IconSort from '@/assets/icons/icon-sort.svg?react';
import IconCheck from '@/assets/icons/icon-check.svg?react';
import { SubmenuItem } from '@/types/submenu';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface SubmenuProps {
  label: string;
  options: SubmenuItem[];
}

export const SortSelect = ({ label, options }: SubmenuProps) => {
  const activeCategory = useSelector((state: RootState) => state.bookmarks.category);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(activeCategory);
  const menuRef = useRef<HTMLUListElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

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
        <ul ref={menuRef} className={styles.dropdown} role="menu">
          {options.map(({ id, label, onClick }) => (
            <li role="none" key={id}>
              <button
                role="menuitem"
                type="button"
                className={`${styles.dropdownControl} ${selectedOption === id ? styles.selected : ''}`}
                onClick={() => {
                  onClick();
                  setIsOpen(false);
                  setSelectedOption(id);
                }}
              >
                <span>{label}</span>
                {selectedOption === id && <IconCheck />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
