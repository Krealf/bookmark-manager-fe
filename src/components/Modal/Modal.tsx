import styles from './Modal.module.scss';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Modal = ({ onClose, children, className, title }: ModalProps) => {
  const mouseDownTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && mouseDownTarget.current === event.target) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      className={`${styles.overlay}`}
      onMouseDown={(e) => (mouseDownTarget.current = e.target)}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-label={title}
    >
      <div className={`${styles.modalWindow} ${className || ''}`}>{children}</div>
    </div>
  );
};
