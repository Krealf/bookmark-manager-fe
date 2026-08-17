import { Bookmark } from '@/types/bookmark';
import { CardMenuItem } from '@/types/dropdown';

export type MenuItemType = 'visit' | 'copy' | 'pin' | 'edit' | 'archive' | 'delete';

type MenuItemsCallbacks = Partial<{
  onVisit: (id: Bookmark['id']) => void;
  onCopy: (url: string) => void;
  onPin: (id: Bookmark['id'], isPinned: boolean) => void;
  onEdit: (bookmark: Bookmark) => void;
  onToggleArchive: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
}>;

interface MenuItemConfig {
  items: MenuItemType[];
  callbacks: MenuItemsCallbacks;
}

export const getMenuItems = (bookmark: Bookmark, config: MenuItemConfig): CardMenuItem[] => {
  const { items, callbacks } = config;

  const menuMap: Record<MenuItemType, CardMenuItem> = {
    visit: {
      type: 'link',
      label: 'Visit',
      iconName: 'visit',
      link: bookmark.websiteUrl,
      onClick: () => callbacks.onVisit?.(bookmark.id),
    },
    copy: {
      type: 'action',
      label: 'Copy URL',
      iconName: 'copy',
      onClick: () => callbacks.onCopy?.(bookmark.websiteUrl),
    },
    pin: {
      type: 'action',
      label: bookmark.pinned ? 'Unpin' : 'Pin',
      iconName: bookmark.pinned ? 'unpin' : 'pin',
      onClick: () => callbacks.onPin?.(bookmark.id, bookmark.pinned),
    },
    edit: {
      type: 'action',
      label: 'Edit',
      iconName: 'edit',
      onClick: () => callbacks.onEdit?.(bookmark),
    },
    archive: {
      type: 'action',
      label: bookmark.isArchived ? 'Unarchive' : 'Archive',
      iconName: bookmark.isArchived ? 'unarchived' : 'archived',
      onClick: () => callbacks.onToggleArchive?.(bookmark),
    },
    delete: {
      type: 'action',
      label: 'Delete Permanently',
      iconName: 'delete',
      onClick: () => callbacks.onDelete?.(bookmark),
    },
  };

  return items.map((item) => menuMap[item]);
};
