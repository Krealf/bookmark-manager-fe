import styles from './Card.module.scss';

import IconVisitCount from '@/assets/icons/icon-visit-count.svg?react';
import IconLastVisited from '@/assets/icons/icon-last-visited.svg?react';
import IconCreatedAt from '@/assets/icons/icon-created.svg?react';
import IconUnpin from '@/assets/icons/icon-unpin.svg?react';
import IconPin from '@/assets/icons/icon-pin.svg?react';

import { CardMenu } from '@/components/CardMenu';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { Bookmark } from '@/types/bookmark';
import { DropdownItem } from '@/types/dropdown';

interface CardProps {
  bookmark: Bookmark;
  menuItems: DropdownItem[];
}

export const Card = ({ bookmark, menuItems }: CardProps) => {
  const { handleUpdateBookmark } = useBookmarksActions();
  const faviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bookmark.websiteUrl}&size=128`;

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.favicon}>
              <img src={faviconUrl} alt="" width={44} height={44} />
            </div>
            <div className={styles.names}>
              <h3 className={styles.title}>{bookmark.title}</h3>
              <div className={styles.url}>
                <p>{bookmark.websiteUrl}</p>
              </div>
            </div>
          </div>
          <CardMenu items={menuItems} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.description}>{bookmark.description}</div>
        <div className={styles.tags}>
          <ul className={styles.tagsList}>
            {bookmark.tags.map((item) => (
              <li className={styles.tagsItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.statsWrapper}>
          <div className={`${styles.statsVisitCount} ${styles.stat}`}>
            <IconVisitCount />
            <span>{bookmark.visitCount}</span>
          </div>
          <div className={`${styles.statsLastVisited} ${styles.stat}`}>
            <IconLastVisited />
            <span>
              <time dateTime={bookmark.lastVisited}>
                {new Date(bookmark.lastVisited).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </time>
            </span>
          </div>
          <div className={`${styles.statsCreatedAt} ${styles.stat}`}>
            <IconCreatedAt />
            <span>
              <time dateTime={bookmark.createdAt}>
                {new Date(bookmark.createdAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </time>
            </span>
          </div>
        </div>
        <button
          className={styles.buttonPin}
          type="button"
          aria-label="Pin bookmark"
          onClick={() =>
            handleUpdateBookmark(
              bookmark.id,
              { pinned: !bookmark.pinned },
              {
                successMessage: `Bookmark ${bookmark.pinned ? 'unpinned' : 'pinned to top'}.`,
                icon: bookmark.pinned ? <IconUnpin /> : <IconPin />,
              },
            )
          }
        >
          {bookmark.pinned ? <IconUnpin /> : <IconPin />}
        </button>
      </div>
    </article>
  );
};
