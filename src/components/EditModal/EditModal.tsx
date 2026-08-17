import styles from './EditModal.module.scss';
import { Modal } from '@/components/Modal';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Bookmark } from '@/types/bookmark';
import { toast } from 'sonner';

interface EditModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onSave: (
    id: Bookmark['id'],
    dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>,
  ) => Promise<Bookmark>;
  bookmark: Bookmark;
}

export const EditModal = (props: EditModalProps) => {
  const [titleBookmark, setTitleBookmark] = useState(props.bookmark.title);
  const [descriptionBookmark, setDescriptionBookmark] = useState(props.bookmark.description);
  const [urlBookmark, setUrlBookmark] = useState(props.bookmark.websiteUrl);
  const [tagsBookmark, setTagsBookmark] = useState(() => props.bookmark.tags.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const updatedPromise = props.onSave(props.bookmark.id, {
      title: titleBookmark.trim(),
      description: descriptionBookmark.trim(),
      websiteUrl: urlBookmark.trim(),
      tags: tagsBookmark
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    });

    toast.promise(updatedPromise, {
      loading: 'Updating the bookmarks...',
      success: 'The bookmark has been updated.',
      error: 'Failed to update bookmark.',
    });

    try {
      await updatedPromise;
      props.onClose();
    } catch (error) {
      console.error('Error while updating the bookmark. Log:', error);
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
              autoFocus
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
