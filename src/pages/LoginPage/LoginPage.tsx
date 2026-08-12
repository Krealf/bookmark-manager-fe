import styles from './LoginPage.module.scss';
import IconLightTheme from '@/assets/icons/logo-light-theme.svg';
import IconDarkTheme from '@/assets/icons/logo-dark-theme.svg';

export const LoginPage = () => {
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
          <h1 className={styles.title}>Log in to your account</h1>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
        </div>
        <form action="" method="post" className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input type="email" name="email" id="email" className={styles.input} required />
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
            />
          </div>
          <div className={styles.formGroup}>
            <input type="submit" name="submit" className={styles.submitButton} value="Log in" />
          </div>
        </form>
        <div className={styles.footerLinks}>
          <p className={styles.footerText}>
            Forgot password?{' '}
            <a href="/" className={styles.link}>
              Reset it
            </a>
          </p>
          <p className={styles.footerText}>
            Don’t have an account?{' '}
            <a href="/" className={styles.link}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
