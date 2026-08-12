import styles from './Modal.module.scss';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Modal = ({ onClose, children, className, title }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null); // Создаём ссылку на само меню для отслеживания клика

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.overlay} ${className}`}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-label={title}
    >
      {children}
    </dialog>
  );
};
