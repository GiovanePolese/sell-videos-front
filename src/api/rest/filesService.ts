import { AxiosProgressEvent } from 'axios';
import { api } from './apiClient';
import { GetActiveFilesResponse, UploadItem } from '../../types/files';

export const getActiveUserFiles = async (userId: number | string): Promise<GetActiveFilesResponse> => {
  const response = await api.get(`/files/user/${userId}/active`);
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