export type iconName =
  | 'visit'
  | 'copy'
  | 'pin'
  | 'unpin'
  | 'edit'
  | 'archived'
  | 'unarchived'
  | 'delete';

// Тип для ссылки
type DropdownLink = {
  type: 'link';
  label: string;
  iconName: iconName;
  link: string; // Обязательно поле link
};

// Тип для кнопки действия
type DropdownAction = {
  type: 'action';
  link?: string;
  label: string;
  iconName: iconName;
  onClick: () => void;
  successMessage?: string;
};

export type DropdownItem = DropdownLink | DropdownAction;
