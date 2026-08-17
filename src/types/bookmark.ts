export interface Bookmark {
  id: string;
  title: string;
  websiteUrl: string;
  faviconUrl: string;
  description: string;
  tags: string[];
  pinned: boolean;
  isArchived: boolean;
  visitCount: number;
  createdAt: string;
  visitedAt: string;
}
