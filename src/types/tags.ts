export interface UserTag {
  key: string;
  name: string;
}

export interface TagWithCount extends UserTag {
  count: number;
}
