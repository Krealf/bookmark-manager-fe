import { useAppSelector } from '@/redux-hook';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />;
  }

  return <Outlet />;
};
