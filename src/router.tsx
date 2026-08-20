import { createBrowserRouter } from 'react-router';
import { Layout } from '@/components/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { AuthPage } from '@/pages/AuthPage';

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
    element: <AuthPage type="login" />,
  },
  {
    path: '/register',
    element: <AuthPage type="register" />,
  },
  {
    // Все остальные неизвестные пути возвращают NotFound
    path: '*',
    element: <NotFoundPage />,
  },
]);
