import axios from 'axios';
import { API_BASE } from './endpoint';
import { getAuthToken } from './userManagment';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 403 && error?.response?.data?.code === 'ACCOUNT_INACTIVE') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.dispatchEvent(new Event('play2learn-auth-updated'));

      if (window.location.pathname !== '/auth/login') {
        window.location.replace('/auth/login');
      }
    }

    return Promise.reject(error);
  },
);

export const unwrapItem = (response) => response?.data?.data ?? response?.data ?? null;

export const unwrapCollection = (response) => ({
  data: response?.data?.data ?? [],
  meta: response?.data?.meta ?? null,
  links: response?.data?.links ?? null,
});

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message
  || error?.response?.data?.error
  || error?.message
  || fallback;
