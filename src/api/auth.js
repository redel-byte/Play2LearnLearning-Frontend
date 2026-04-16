import toast from 'react-hot-toast';
import { apiClient, getErrorMessage } from './api';
import { clearStoredUser, getStoredUser, setStoredUser } from './userManagment';

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/password/forgot', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (token, email, password, passwordConfirmation) => {
  try {
    const response = await apiClient.post('/password/reset', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Login failed'));
  }
};

export const AuthRegister = async (firstName, lastName, email, password, role) => {
  try {
    const response = await apiClient.post('/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const Logout = async () => {
  try {
    const response = await apiClient.post('/logout');
    clearStoredUser();
    toast.success(response?.data?.message || 'Logged out successfully');
    return response.data;
  } catch {
    clearStoredUser();
    toast.success('Logged out successfully');
    return null;
  }
};

export const deleteMyAccount = async () => {
  try {
    const response = await apiClient.delete('/me');
    clearStoredUser();
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to delete your account'));
  }
};

export const refreshSession = async () => {
  try {
    const response = await apiClient.post('/refresh');
    const storedUser = getStoredUser();

    if (storedUser && response?.data?.token) {
      const nextUser = {
        ...storedUser,
        token: response.data.token,
      };
      setStoredUser(nextUser);
    }

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to refresh session'));
  }
};

export const fetchMe = async () => {
  try {
    const response = await apiClient.get('/me');
    return response.data?.user ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to load your profile'));
  }
};

export const fetchAuthenticatedUser = async () => {
  try {
    const user = await fetchMe();
    const storedUser = getStoredUser();

    if (storedUser && user) {
      setStoredUser({
        ...storedUser,
        user,
      });
    }

    return user;
  } catch {
    try {
      const response = await apiClient.get('/user');
      const user = response.data ?? null;
      const storedUser = getStoredUser();

      if (storedUser && user) {
        setStoredUser({
          ...storedUser,
          user,
        });
      }

      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to sync your session'));
    }
  }
};

export const updateMyProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/me', profileData);
    const user = response.data?.user ?? null;
    const storedUser = getStoredUser();

    if (storedUser && user) {
      setStoredUser({
        ...storedUser,
        user,
      });
    }

    return {
      message: response.data?.message || 'Profile updated successfully',
      user,
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};
