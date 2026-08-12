import styles from './Checkbox.module.scss';
import { useCallback, useState } from 'react';

interface CheckboxProps {
  label: string;
  onChange?: () => void;
  disabled?: boolean;
  id: string;
}

export const Checkbox = ({ label, onChange, disabled, id }: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const handleChecked = useCallback(() => {
    setChecked((prev) => !prev);
    if (onChange) {
      onChange();
    }
  }, [onChange]);

  return (
    <div className={styles.checkbox}>
      <input
        aria-label={`Select the "${label}" tag for the filter`}
        id={id}
        name=""
        type="checkbox"
        className={`${styles.input}`}
        checked={checked}
        disabled={disabled}
        onChange={handleChecked}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
