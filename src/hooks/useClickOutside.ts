import { type RefObject, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  currentRef: RefObject<T | null>,
  onClose: () => void,
): void {
  const savedCallback = useRef(onClose);

  useEffect(() => {
    savedCallback.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Создаём функцию-слушатель
    const handleOutsideClick = (event: MouseEvent) => {
      // Есть ли вообще меню в DOM и Был ли клик внутри мен-обёртки?
      if (currentRef?.current && !currentRef.current.contains(event.target as Node)) {
        savedCallback.current();
      }
    };

    // Вешаем обработчик на событие клика
    document.addEventListener('mousedown', handleOutsideClick);

    // Удаляем обработчик при закрытии меню
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [currentRef]);
}
