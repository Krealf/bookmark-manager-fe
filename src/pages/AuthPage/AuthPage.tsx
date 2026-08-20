import styles from './AuthPage.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux-hook';
import { Navigate, useLocation } from 'react-router';
import { SubmitEvent, useState } from 'react';
import { login, registration } from '@/features/Users/authActions';
import IconLightTheme from '@/assets/icons/logo-light-theme.svg';
import IconDarkTheme from '@/assets/icons/logo-dark-theme.svg';

export type AuthType = 'login' | 'register';

interface AuthPageProps {
  type: AuthType;
}

export const AuthPage = ({ type }: AuthPageProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const AuthTitle = type === 'login' ? 'Log in to your account' : 'Create your account';
  const AuthButton = type === 'login' ? 'Log in' : 'Create account';
  const AuthDescription =
    type === 'login'
      ? 'Welcome back! Please enter your details.'
      : 'Join us and start saving your favorite links — organized, searchable, and always within reach.';

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (type === 'login') dispatch(login({ email, password }));

    dispatch(registration({ fullName, email, password }));
  };

  if (isLoading) {
    return <div className="page-loader">Загрузка...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a href="/" className={styles.headerLogo} aria-label="Homepage bookmark-manager">
          <img
            src={IconLightTheme}
            alt=""
            loading="lazy"
            className={styles.logoLight}
            aria-hidden={true}
          />
          <img
            src={IconDarkTheme}
            alt=""
            loading="lazy"
            className={styles.logoDark}
            aria-hidden={true}
          />
        </a>
        <div className={styles.header}>
          <h1 className={styles.title}>{AuthTitle}</h1>
          <p className={styles.subtitle}>{AuthDescription}</p>
        </div>
        <form action="" method="post" className={styles.form} onSubmit={handleSubmit}>
          {type === 'register' && (
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Full name
              </label>
              <input
                type="fullname"
                name="fullname"
                id="fullname"
                className={styles.input}
                required
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={styles.input}
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.input}
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className={styles.formGroup}>
            <input type="submit" name="submit" className={styles.submitButton} value={AuthButton} />
          </div>
        </form>
        {type === 'login' ? (
          <div className={styles.footerLinks}>
            <p className={styles.footerText}>
              Don’t have an account?{' '}
              <a href="/register" className={styles.link}>
                Sign up
              </a>
            </p>
          </div>
        ) : (
          <div className={styles.footerLinks}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <a href="/login" className={styles.link}>
                Log in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
