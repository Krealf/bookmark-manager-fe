import { useAppSelector } from '@/redux-hook';
import { Navigate, Outlet, useLocation } from 'react-router';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <div className="page-loader">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
