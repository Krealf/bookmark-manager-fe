import styles from './FormModal.module.scss';
import { Bookmark } from '@/types/bookmark';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import IconClose from '@/assets/icons/icon-close.svg?react';
import { toast } from 'sonner';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { TagInput } from '@/components/TagInput';
import { selectAllTags } from '@/features/Bookmarks/bookmarksSelectors';

export type BookmarkFormData = {
  title: string;
  websiteUrl: string;
  description: string;
  tags: string[];
};

interface FormModalProps {
  initialBookmark?: Bookmark;
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (formData: BookmarkFormData) => Promise<Bookmark>;
}

export const FormModal = ({ initialBookmark, onClose, onSubmit }: FormModalProps) => {
  const isEditMode = Boolean(initialBookmark);
  const existingTags = useSelector(selectAllTags);

  const [formData, setFormData] = useState<BookmarkFormData>({
    title: initialBookmark?.title ?? '',
    websiteUrl: initialBookmark?.websiteUrl ?? '',
    description: initialBookmark?.description ?? '',
    tags: initialBookmark?.tags ?? [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const modalTitle = isEditMode ? 'Edit bookmark' : 'Add a Bookmark';
  const modalSubscription = isEditMode
    ? 'Update your saved link details — change the title, description, URL, or tags anytime.'
    : 'Save a link with details to keep your collection organized.';
  const modalSubmit = isEditMode ? 'Save Bookmark' : 'Add Bookmark';

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const cleanData: BookmarkFormData = {
      title: formData.title.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      description: formData.description.trim(),
      tags: formData.tags,
    };

    const actionPromise = onSubmit(cleanData);

    toast.promise(actionPromise, {
      loading: isEditMode ? 'Updating bookmark...' : 'Creating a bookmark...',
      success: isEditMode ? 'The bookmark has been updated.' : 'The bookmark has been created.',
      error: isEditMode ? 'Failed to update bookmark' : 'Failed to create bookmark.',
    });

    try {
      await actionPromise;
      onClose();
    } catch (error) {
      console.error('Error saving bookmark:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal onClose={onClose} className={styles.modalWindow} title={modalTitle}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <div className={styles.captions}>
            <h2 className={styles.title}>{modalTitle}</h2>
            <div className={styles.description}>{modalSubscription}</div>
          </div>
          <Button variant="secondary" icon={IconClose} size="sm" onClick={() => onClose()}></Button>
        </div>
        <div className={styles.body}>
          <label className={styles.field}>
            <div className={styles.label}>
              Title <span className={styles.required}>*</span>
            </div>
            <input
              value={formData.title}
              className={styles.input}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              autoFocus
            />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>
              Description <span className={styles.required}>*</span>
            </div>
            <textarea
              className={`${styles.textarea} ${styles.input}`}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>
              Website URL <span className={styles.required}>*</span>
            </div>
            <input
              className={styles.input}
              value={formData.websiteUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
              required
            />
          </label>
          <div className={styles.field}>
            <div className={styles.label}>
              Tags <span className={styles.required}>*</span>
            </div>
            <TagInput
              existingTags={existingTags}
              value={formData.tags}
              onChange={(newTags: string[]) => setFormData((prev) => ({ ...prev, tags: newTags }))}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
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
            {modalSubmit}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
