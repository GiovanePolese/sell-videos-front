import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const login = async (name: string, password: string): Promise<{ access_token: string }> => {
  const response = await axios.post(`${API_URL}/login`, { name, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getProfile = async (): Promise<any> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
