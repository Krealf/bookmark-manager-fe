import type { ReactNode } from 'react';

export type SubmenuItem = {
  label: string;
  id: string;
  onClick: () => void;
};

export interface UpdateOptions {
  successMessage?: string;
  icon?: ReactNode;
}
