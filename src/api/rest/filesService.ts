import { AxiosProgressEvent } from 'axios';
import { api } from './apiClient';
import { Album, UploadFilesResponse, VideoFile } from '../../types/files';

export const uploadFiles = async (
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadFilesResponse> => {
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });

  return response.data;
};

export const getUserAlbums = async (): Promise<Album[]> => {
  const response = await api.get('/files/albums');
  return response.data;
};

export const getPublicAlbumBySlug = async (slug: string): Promise<Album> => {
  const response = await api.get(`/files/albums/${slug}`);
  return response.data;
};

export const getVideosByAlbum = async (albumId: string): Promise<VideoFile[]> => {
  const response = await api.get(`/files/albums/${albumId}/videos`);
  return response.data;
};
