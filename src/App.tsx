import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { useEffect } from 'react';
import { getToken } from '@/services/AuthService';
import { useAppDispatch } from '@/redux-hook';
import { checkAuth } from '@/features/Users/authActions';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (getToken() == null) {
      dispatch(checkAuth());
    }
  }, []);

  return <RouterProvider router={router} />;
};
