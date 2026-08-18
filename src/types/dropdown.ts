export type CardMenuIcon =
  | 'visit'
  | 'copy'
  | 'pin'
  | 'unpin'
  | 'edit'
  | 'archived'
  | 'unarchived'
  | 'delete';

interface BaseCardMenuItem {
  label: string;
  iconName: CardMenuIcon;
  onClick: () => void;
}

export interface CardMenuLinkItem extends BaseCardMenuItem {
  type: 'link';
  url: string;
}

export interface CardMenuActionItem extends BaseCardMenuItem {
  type: 'action';
}

export type CardMenuItem = CardMenuLinkItem | CardMenuActionItem;
