export type CardMenuIcon =
  | 'visit'
  | 'copy'
  | 'pin'
  | 'unpin'
  | 'edit'
  | 'archived'
  | 'unarchived'
  | 'delete';

// Тип для ссылки
type CardMenuLink = {
  type: 'link';
  label: string;
  iconName: CardMenuIcon;
  link: string;
  onClick?: () => void;
};

// Тип для кнопки действия
type CardMenuAction = {
  type: 'action';
  label: string;
  iconName: CardMenuIcon;
  onClick: () => void;
};

export type CardMenuItem = CardMenuLink | CardMenuAction;
