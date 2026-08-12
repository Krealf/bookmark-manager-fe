import { createBrowserRouter } from 'react-router';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ArchivedPage } from '@/pages/ArchivedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Создаём роутер
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Обёртка
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          // Внутри обёртки рисуются дети:
          { index: true, element: <HomePage /> },
          { path: 'archived', element: <ArchivedPage /> },
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
