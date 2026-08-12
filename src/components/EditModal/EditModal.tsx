import styles from './EditModal.module.scss';
import { Modal } from '@/components/Modal';
import type { Bookmark, UpdateOptions } from '@my-app/shared';
import React, { useState } from 'react';
import { Button } from '@/components/Button';

interface EditModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onSave: (
    id: Bookmark['id'],
    dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>,
    options: UpdateOptions,
  ) => void;
  bookmark: Bookmark;
}

export const EditModal = (props: EditModalProps) => {
  const [titleBookmark, setTitleBookmark] = useState(props.bookmark.title);
  const [descriptionBookmark, setDescriptionBookmark] = useState(props.bookmark.description);
  const [urlBookmark, setUrlBookmark] = useState(props.bookmark.url);
  const [tagsBookmark, setTagsBookmark] = useState(() => props.bookmark.tags.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      props.onSave(
        props.bookmark.id,
        {
          title: titleBookmark.trim(),
          description: descriptionBookmark.trim(),
          url: urlBookmark.trim(),
          tags: tagsBookmark.split(', ').flatMap((tag) => {
            const trimmed = tag.trim();
            return trimmed ? [trimmed] : [];
          }),
        },
        { successMessage: 'Changes saved.' },
      );
      props.onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal onClose={props.onClose} className={styles.modalWindow} title="Edit bookmark">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{props.title}</h2>
          <div className={styles.description}>{props.description}</div>
        </div>
        <div className={styles.body}>
          <label className={styles.field}>
            <div className={styles.label}>
              Title <span className={styles.required}>*</span>
            </div>
            <input
              value={titleBookmark}
              className={styles.input}
              onChange={(e) => setTitleBookmark(e.target.value)}
              required
              name=""
            />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>
              Description <span className={styles.required}>*</span>
            </div>
            <textarea
              className={`${styles.textarea} ${styles.input}`}
              value={descriptionBookmark}
              onChange={(e) => setDescriptionBookmark(e.target.value)}
              required
              name=""
            />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>
              Website URL <span className={styles.required}>*</span>
            </div>
            <input
              className={styles.input}
              value={urlBookmark}
              onChange={(e) => setUrlBookmark(e.target.value)}
              required
              name=""
            />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>
              Tags <span className={styles.required}>*</span>
            </div>
            <input
              className={styles.input}
              value={tagsBookmark}
              onChange={(e) => setTagsBookmark(e.target.value)}
              required
              name=""
            />
          </label>
        </div>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="md"
            onClick={props.onClose}
            type="button"
            className={`${styles.cancel}`}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            className={`${styles.cancel}`}
            disabled={isSaving}
          >
            {props.confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
