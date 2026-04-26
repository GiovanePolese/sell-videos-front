import { UserProfile } from '../../types/user';
import { api } from './apiClient';

export const login = async (name: string, password: string): Promise<{ access_token: string }> => {
  const response = await api.post('/auth/login', { name, password });
  
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/auth/profile');
  return response.data;
};
