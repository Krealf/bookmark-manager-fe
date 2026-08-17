import styles from './AddModal.module.scss';
import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Bookmark } from '@/types/bookmark';
import { UpdateOptions } from '@/types/submenu';
import { useBookmarksActions } from '@/hooks/useBookmarksActions';
import { toast } from 'sonner';

interface AddModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onSave: (
    dto: Required<Pick<Bookmark, 'title' | 'description' | 'websiteUrl' | 'tags'>>,
    options: UpdateOptions,
  ) => void;
}

export const AddModal = (props: AddModalProps) => {
  const [titleBookmark, setTitleBookmark] = useState('');
  const [descriptionBookmark, setDescriptionBookmark] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tagsBookmark, setTagsBookmark] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { handleAddBookmark } = useBookmarksActions();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const updatedPromise = handleAddBookmark({
      title: titleBookmark,
      websiteUrl,
      description: descriptionBookmark,
      tags: tagsBookmark,
    });

    toast.promise(updatedPromise, {
      loading: 'Creating a bookmark...',
      success: 'The bookmark has been created.',
      error: 'Error while creating a bookmark.',
    });

    try {
      await updatedPromise;
      props.onClose();
    } catch (error) {
      console.error('Error while creating the bookmark. Log:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal onClose={props.onClose} className={styles.modalWindow} title="Add a Bookmark">
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
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
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
              onChange={(e) => setTagsBookmark(e.target.value.split(','))}
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
