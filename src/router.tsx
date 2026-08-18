import { createBrowserRouter } from 'react-router';
import { Layout } from '@/components/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BookmarksPage } from '@/pages/BookmarksPage';

// Создаём роутер
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Обёртка
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <BookmarksPage /> },
          { path: 'archived', element: <BookmarksPage isArchived={true} /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Все остальные неизвестные пути возвращают NotFound
    path: '*',
    element: <NotFoundPage />,
  },
]);
