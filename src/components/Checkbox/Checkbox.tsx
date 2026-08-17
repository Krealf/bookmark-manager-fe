import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id: string;
}

export const Checkbox = ({ label, onChange, disabled, checked, id }: CheckboxProps) => {
  return (
    <div className={styles.checkbox}>
      <input
        aria-label={`Select the "${label}" tag for the filter`}
        id={id}
        type="checkbox"
        className={`${styles.input}`}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
