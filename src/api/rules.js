import axios from 'axios';
import { endpoints } from './endpoint';
import { getAuthToken } from './userManagment';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`
});

export const fetchRules = async () => {
  try {
    const response = await axios.get(`${endpoints.rules}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRules = async (rulesData) => {
  try {
    const response = await axios.put(`${endpoints.rules}`, rulesData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePermissions = async (role, permissions) => {
  try {
    const response = await axios.patch(`${endpoints.rules}/permissions`, {
      role,
      permissions
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateFeatureFlags = async (flags) => {
  try {
    const response = await axios.patch(`${endpoints.rules}/feature-flags`, {
      flags
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateContentRules = async (rules) => {
  try {
    const response = await axios.patch(`${endpoints.rules}/content`, {
      rules
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLearningRules = async (rules) => {
  try {
    const response = await axios.patch(`${endpoints.rules}/learning`, {
      rules
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const validateContent = async (content) => {
  try {
    const response = await axios.post(`${endpoints.rules}/validate-content`, {
      content
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkUserPermissions = async (userId, resource, action) => {
  try {
    const response = await axios.get(`${endpoints.rules}/check-permission`, {
      params: { userId, resource, action },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserRules = async (userId) => {
  try {
    const response = await axios.get(`${endpoints.rules}/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const setUserRules = async (userId, rules) => {
  try {
    const response = await axios.post(`${endpoints.rules}/user/${userId}`, {
      rules
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetRulesToDefault = async () => {
  try {
    const response = await axios.post(`${endpoints.rules}/reset`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

