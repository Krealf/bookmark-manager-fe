import { useAppDispatch, useAppSelector } from '@/redux-hook';
import { useEffect } from 'react';
import { fetchMe } from '@/features/Users/authActions';
import { RouterProvider } from 'react-router';
import { router } from '@/router';

export const App = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (status === 'idle' || status === 'loading') {
    return <div>Full screen loader</div>;
  }

  return <RouterProvider router={router} />;
};
