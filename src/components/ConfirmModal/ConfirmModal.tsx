import styles from './ConfirmModal.module.scss';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useState } from 'react';

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const [isSaving, setIsSaving] = useState(false);

  async function handleConfirmClick() {
    setIsSaving(true);

    try {
      props.onClose();
      await props.onConfirm();
    } catch (error) {
      console.error('Error when confirming the action in the confirm modal. Log:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal onClose={props.onClose} className={styles.modalWindow} title={props.title}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{props.title}</h2>
        <div className={styles.description}>{props.description}</div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="md"
          onClick={props.onClose}
          type="button"
          className={`${styles.cancel}`}
        >
          Cancel
        </Button>
        <Button
          variant={props.danger ? 'danger' : 'primary'}
          size="md"
          onClick={handleConfirmClick}
          type="button"
          disabled={isSaving}
        >
          {props.confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
