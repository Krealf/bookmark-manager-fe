import styles from './CardSkeleton.module.scss';

export const CardSkeleton = () => (
  <article className={styles.card}>
    <div className={styles.header}>
      <div className={styles.favicon} />
      <div className={styles.info}>
        <div className={styles.title} />
        <div className={styles.url} />
      </div>
    </div>
    <div className={styles.description} />
    <div className={styles.footer}>
      <div className={styles.stat} />
      <div className={styles.stat} />
      <div className={styles.stat} />
    </div>
  </article>
);
