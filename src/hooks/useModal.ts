import { useCallback, useEffect, useState } from 'react';
import type { Bookmark } from '@my-app/shared';

// Определяем возможные типы модального окна
type ModalState =
  | { type: 'add' }
  | { type: 'edit'; bookmark: Bookmark; id: string }
  | { type: 'confirm-archive'; bookmark: Bookmark; id: string }
  | { type: 'confirm-unarchive'; bookmark: Bookmark; id: string }
  | { type: 'confirm-delete'; bookmark: Bookmark; id: string }
  | null;

export function useModal() {
  // Говорим какие значения может принимать useState
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  useEffect(() => {
    if (activeModal) {
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }

    return () => document.documentElement.classList.remove('modal-open');
  }, [activeModal]);

  // Функция для открытия модального окна нужного типа
  const openModal = useCallback((modal: NonNullable<ModalState>) => setActiveModal(modal), []);

  // Функция для закрытия модального окна
  const closeModal = useCallback(() => setActiveModal(null), []);

  return { activeModal, openModal, closeModal };
}
