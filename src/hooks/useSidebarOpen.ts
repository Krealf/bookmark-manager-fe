import { useEffect, useState } from 'react';

const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

export function useSidebarOpen() {
  const [isOpen, setIsOpen] = useState(() => !isMobile());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(!e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return { isOpen, openSidebar, closeSidebar, toggleSidebar };
}
