import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Bookmark } from '@/types/bookmark';
import $api from '@/utils/fetchApi';
import { ApiErrorPayload, extractApiError } from '@/utils/handleAxiosError';

interface UpdateBookmarkArgs {
  id: Bookmark['id'];
  dto: Partial<Omit<Bookmark, 'id' | 'createdAt'>>;
}

export const fetchAllBookmarks = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ApiErrorPayload }
>('bookmarks/fetchBookmarks', async (_, { rejectWithValue }) => {
  try {
    const response = await $api.get('bookmarks');

    return response.data;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});

export const updateBookmarkById = createAsyncThunk<
  Bookmark,
  UpdateBookmarkArgs,
  { rejectValue: ApiErrorPayload }
>('bookmarks/updateById', async ({ id, dto }, { rejectWithValue }) => {
  try {
    const response = await $api.patch(`bookmarks/${id}`, dto);

    return response.data;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});

export const visitBookmarkById = createAsyncThunk<
  Bookmark,
  Bookmark['id'],
  { rejectValue: ApiErrorPayload }
>('bookmarks/visit', async (id, { rejectWithValue }) => {
  try {
    const response = await $api.post(`bookmarks/${id}/visit`);

    return response.data;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});

export const deleteBookmarkById = createAsyncThunk<
  Bookmark['id'],
  Bookmark['id'],
  { rejectValue: ApiErrorPayload }
>('bookmarks/deleteById', async (id, { rejectWithValue }) => {
  try {
    await $api.delete(`api/bookmarks/${id}`);

    return id;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});

export const createBookmark = createAsyncThunk<
  Bookmark,
  Required<Pick<Bookmark, 'title' | 'description' | 'websiteUrl' | 'tags'>>,
  { rejectValue: ApiErrorPayload }
>('bookmarks/createBookmark', async (dto, { rejectWithValue }) => {
  try {
    const response = await $api.post('bookmarks', dto);

    return response.data;
  } catch (error) {
    return rejectWithValue(extractApiError(error));
  }
});
