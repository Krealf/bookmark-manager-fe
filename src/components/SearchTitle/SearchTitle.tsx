import styles from './SearchTitle.module.scss';

interface SearchTitleProps {
  query: string;
  tags: string[];
  defaultText: string;
}

export const SearchTitle = ({ query, tags, defaultText }: SearchTitleProps) => {
  if (query.length > 0 && tags.length > 0) {
    return (
      <h1 className={styles.title}>
        Results for: <span className={styles.query}>"{query}"</span> and{' '}
        {tags.map((tag, index) => (
          <span key={tag}>
            <span className={styles.query}>{tag}</span>
            {index < tags.length - 1 ? ', ' : ''}
          </span>
        ))}
      </h1>
    );
  } else if (tags.length > 0) {
    return (
      <h1 className={styles.title}>
        Bookmarks tagged:{' '}
        {tags.map((tag, index) => (
          <span key={tag}>
            <span className={styles.query}>{tag}</span>
            {index < tags.length - 1 ? ', ' : ''}
          </span>
        ))}
      </h1>
    );
  } else if (query.length > 0) {
    return (
      <h1 className={styles.title}>
        Results for: <span className={styles.query}>"{query}"</span>
      </h1>
    );
  } else {
    return <h1 className={styles.title}>{defaultText}</h1>;
  }
};
