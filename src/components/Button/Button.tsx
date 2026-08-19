import styles from './Button.module.scss';
import React, { type ComponentPropsWithoutRef, type SVGProps } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'white';
type ButtonSize = 'sm' | 'md';
type ButtonType = 'Default' | 'Error';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: React.ReactNode;
  typeButton?: ButtonType;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & ComponentPropsWithoutRef<'button'>;

export const Button = React.memo(
  ({
    type = 'button',
    variant = 'primary',
    size = 'sm',
    isLoading = false,
    typeButton = 'Default',
    children,
    icon: Icon,
    onClick,
    disabled,
    className,
    ...rest
  }: ButtonProps) => {
    return (
      <button
        type={type}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${styles[typeButton]} ${className || ''}`}
        disabled={disabled || isLoading}
        {...rest}
        onClick={onClick}
      >
        {Icon && <Icon />}
        {isLoading ? 'Loading...' : children && <span>{children}</span>}
      </button>
    );
  },
);
