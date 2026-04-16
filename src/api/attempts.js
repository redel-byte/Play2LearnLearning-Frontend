import { apiClient, unwrapCollection, unwrapItem } from './api';

export const getMyAttemptHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/attempts/my-history', { params });
    return unwrapCollection(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const startQuizAttempt = async (quizId, payload = {}) => {
  try {
    const response = await apiClient.post(`/quizzes/${quizId}/attempts`, payload);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAttempt = async (attemptId) => {
  try {
    const response = await apiClient.get(`/attempts/${attemptId}`);
    return unwrapItem(response);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitAttemptAnswers = async (attemptId, answers, finalize = true) => {
  try {
    const response = await apiClient.post(`/attempts/${attemptId}/answers`, {
      answers,
      finalize,
    });
    return unwrapItem(response);
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

