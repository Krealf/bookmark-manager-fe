import styles from './SearchField.module.scss';
import React, { type SVGProps } from 'react';
import { useAppDispatch } from '@/redux-hook';
import { setSearchQuery } from '@/features/Bookmarks/bookmarksSlice';

interface SearchFieldProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  placeholder: string;
  isError?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
}

export const SearchField = ({
  isLoading = false,
  isError = false,
  children,
  className,
  disabled,
  placeholder,
  icon: Icon,
}: SearchFieldProps) => {
  const dispatch = useAppDispatch();

  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <search className={styles.search}>
      <label htmlFor="search" className={`${styles.label}`}>
        <span className={`visually-hidden`}>Search bookmarks by title</span>
        {Icon && <Icon aria-hidden={true} />}
      </label>
      <input
        id="search"
        type="search"
        name="search"
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search"
        aria-invalid={isError}
        className={`${styles.input} ${className ?? ''} ${isError ? styles.error : ''} `}
        disabled={disabled || isLoading}
        onChange={handleInputSearch}
      />
      {isLoading ? 'Загрузка...' : children}
    </search>
  );
};
