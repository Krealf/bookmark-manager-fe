import styles from './TagInput.module.scss';
import { UserTag } from '@/types/tags';
import { useMemo, useRef, useState } from 'react';
import IconDelete from '@/assets/icons/icon-delete.svg?react';
import { KeyboardEvent } from 'react';

interface TagInputProps {
  existingTags: UserTag[];
  value: string[];
  onChange: (newTags: string[]) => void;
  className?: string;
  maxTags?: number;
}

export const TagInput = ({
  existingTags,
  value: selectedTags,
  className,
  onChange,
  maxTags = 5,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const canonicalMap = useMemo(() => {
    const map = new Map<string, string>();
    existingTags.forEach((t) => map.set(t.key, t.name));
    return map;
  }, [existingTags]);

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();

    if (!query) return [];

    const selectedKeys = new Set(selectedTags.map((t) => t.toLowerCase()));

    return existingTags.filter((tag) => tag.key.includes(query) && !selectedKeys.has(tag.key));
  }, [existingTags, inputValue, selectedTags]);

  const handleAddTag = (rawTagName: string) => {
    const cleanName = rawTagName.trim().replace(/,/g, '');

    if (!cleanName) return;

    if (selectedTags.length >= maxTags) return;

    const key = cleanName.toLowerCase();
    const alreadySelected = selectedTags.some((t) => t.trim().toLowerCase() === key);

    if (alreadySelected) {
      setInputValue('');
      setIsOpen(false);
      return;
    }

    const finalTagName = canonicalMap.get(key) || cleanName;

    onChange([...selectedTags, finalTagName]);
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(selectedTags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      handleAddTag(inputValue);
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      if (inputValue.trim()) {
        event.preventDefault();

        if (suggestions.length > 0 && isOpen) {
          const picked = suggestions[highlightedIndex] || suggestions[0];
          handleAddTag(picked.name);
        } else {
          handleAddTag(inputValue);
        }
      }
    } else if (event.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags.length - 1);
    } else if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Escape') {
      if (isOpen) {
        event.stopPropagation();
        setIsOpen(false);
      }
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tagWrapper} onClick={() => inputRef.current?.focus()}>
        {selectedTags.map((tag, index) => (
          <span key={`${tag}-${index}`} className={styles.badge}>
            {tag}
            <button
              type="button"
              className={styles.removeButton}
              aria-label={`Remove tag ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(index);
              }}
            >
              <IconDelete />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          type="text"
          placeholder={selectedTags.length === 0 ? 'Add tags (e.g. Git, SCSS)...' : ''}
          onChange={(event) => {
            setInputValue(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {suggestions.map((suggestion, idx) => (
            <li
              key={suggestion.key}
              role="option"
              className={`${styles.dropdownItem} ${idx === highlightedIndex ? styles.highlighted : ''}`}
              onMouseDown={() => handleAddTag(suggestion.name)}
            >
              <span>{suggestion.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
