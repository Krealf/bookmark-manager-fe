import { useAppSelector } from '@/redux-hook';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const { status } = useAppSelector((state) => state.auth);
  
  if (status === "idle" || status === "loading") {
    return (<div>Loading protected</div>)
  }
  
  if (status === "unauthenticated") {
    return (<Navigate to={"/login"} replace/>)
  }
  
  return <Outlet />
};
