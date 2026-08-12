export const initTheme = () => {
  const savedTheme = localStorage.getItem('app-theme');

  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else {
    // Опционально: проверка системной темы, если в localStorage пусто
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    document.body.setAttribute('data-theme', isSystemDark ? 'dark' : 'light');
  }
};
