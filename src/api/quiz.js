import { apiClient, unwrapCollection, unwrapItem } from './api';

export const fetchQuizzes = async (params = {}) => {
  try {
    const response = await apiClient.get('/quizzes', { params });
    return unwrapCollection(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchQuiz = async (quizId) => {
  try {
    const response = await apiClient.get(`/quizzes/${quizId}`);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await apiClient.post('/quizzes', quizData);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await apiClient.put(`/quizzes/${quizId}`, quizData);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const response = await apiClient.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const duplicateQuiz = async (quizId) => {
  try {
    const response = await apiClient.post(`/quizzes/${quizId}/duplicate`);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const shareQuiz = async (quizId, shareData) => {
  try {
    const response = await apiClient.post(`/quizzes/${quizId}/share`, shareData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const publishQuiz = async (quizId) => {
  try {
    const response = await apiClient.patch(`/quizzes/${quizId}/publish`);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unpublishQuiz = async (quizId) => {
  try {
    const response = await apiClient.patch(`/quizzes/${quizId}/unpublish`);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuizResults = async (quizId) => {
  try {
    const response = await apiClient.get(`/quizzes/${quizId}/results`);
    return unwrapCollection(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const joinQuizByCode = async (code) => {
  try {
    const response = await apiClient.post('/quizzes/join', { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

