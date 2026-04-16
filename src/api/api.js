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

export const unwrapItem = (response) => response?.data?.data ?? response?.data ?? null;

export const unwrapCollection = (response) => ({
  data: response?.data?.data ?? [],
  meta: response?.data?.meta ?? null,
  links: response?.data?.links ?? null,
});

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message
  || error?.message
  || fallback;
