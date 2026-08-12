import styles from './ToggleSwitch.module.scss';
import { useTheme } from '@/hooks/useTheme';

import IconMoon from '@/assets/icons/icon-dark-theme.svg?react';
import IconSun from '@/assets/icons/icon-light-theme.svg?react';

export const ToggleSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.wrapper}>
      <label className={styles.switch}>
        <input
          id=""
          name=""
          type="checkbox"
          onChange={toggleTheme}
          hidden
          checked={theme === 'dark'}
        />
        <span className={styles.slider}>
          <IconSun className={styles.icon} />
          <IconMoon className={styles.icon} />
        </span>
      </label>
    </div>
  );
};
