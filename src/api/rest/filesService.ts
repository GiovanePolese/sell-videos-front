import { AxiosProgressEvent } from 'axios';
import { api } from './apiClient';
import { AlbumSummary, GetActiveFilesResponse, UploadItem } from '../../types/files';

export const getActiveUserFiles = async (userId: number | string, album?: string): Promise<GetActiveFilesResponse> => {
  const params = album ? { album } : {};
  const response = await api.get(`/files/user/${userId}/active`, { params });
  return response.data;
};

export const uploadFiles = async (
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadItem> => {
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress, 
  });

  return response.data;
};

export const getUserAlbums = async (): Promise<AlbumSummary[]> => {
  const response = await api.get('/files/albums');
  return response.data;
};