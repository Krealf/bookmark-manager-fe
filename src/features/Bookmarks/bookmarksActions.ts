import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Bookmark } from '@/types/bookmark';
import $api from '@/utils/fetchApi';

const BASE_URL = import.meta.env.VITE_API_URL + '/bookmarks';

interface UpdateBookmarkArgs {
  id: Bookmark['id'];
  dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>;
}

export const fetchAllBookmarks = createAsyncThunk<Bookmark[]>(
  'bookmarks/fetchBookmarks',
  async () => (await $api.get('bookmarks')).data,
);

export const updateBookmarkById = createAsyncThunk<Bookmark, UpdateBookmarkArgs>(
  'bookmarks/updateById',
  async ({ id, dto }) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(dto),
    });

    return await response.json();
  },
);

export const deleteBookmarkById = createAsyncThunk<Bookmark['id'], Bookmark['id']>(
  'bookmarks/deleteById',
  async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return id;
    } else {
      throw new Error('Error');
    }
  },
);

export const createBookmark = createAsyncThunk<
  Bookmark,
  Required<Pick<Bookmark, 'title' | 'description' | 'url' | 'tags'>>
>('bookmarks/createBookmark', async (dto) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error');
  }
});
