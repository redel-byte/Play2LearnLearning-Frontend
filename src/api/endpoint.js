const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const endpoints = {
    login: `${API_BASE_URL}/api/login`,
    logout: `${API_BASE_URL}/api/logout`,
    register: `${API_BASE_URL}/api/register`,
    forgotPassword: `${API_BASE_URL}/api/password/forgot`,
    resetPassword: `${API_BASE_URL}/api/password/reset`,
    
    user: `${API_BASE_URL}/api/user`,
    me: `${API_BASE_URL}/api/me`,
    refresh: `${API_BASE_URL}/api/refresh`,
    
    myHistory: `${API_BASE_URL}/api/attempts/my-history`,
    joinQuiz: `${API_BASE_URL}/api/quizzes/join`,
    startAttempt: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/attempts`,
    showAttempt: (attemptId) => `${API_BASE_URL}/api/attempts/${attemptId}`,
    submitAnswers: (attemptId) => `${API_BASE_URL}/api/attempts/${attemptId}/answers`,
    
    quizzes: `${API_BASE_URL}/api/quizzes`,
    quizResults: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/results`,
    duplicateQuiz: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/duplicate`,
    shareQuiz: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/share`,
    publishQuiz: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/publish`,
    unpublishQuiz: (quizId) => `${API_BASE_URL}/api/quizzes/${quizId}/unpublish`,
    
    adminUsers: `${API_BASE_URL}/api/admin/users`,
    adminUserShow: (userId) => `${API_BASE_URL}/api/admin/users/${userId}`,
    adminUserUpdate: (userId) => `${API_BASE_URL}/api/admin/users/${userId}`,
    
    rules: `${API_BASE_URL}/api/rules`,
    rulesPermissions: `${API_BASE_URL}/api/rules/permissions`,
    rulesFeatureFlags: `${API_BASE_URL}/api/rules/feature-flags`,
    rulesContent: `${API_BASE_URL}/api/rules/content`,
    rulesLearning: `${API_BASE_URL}/api/rules/learning`,
    rulesValidateContent: `${API_BASE_URL}/api/rules/validate-content`,
    rulesCheckPermission: `${API_BASE_URL}/api/rules/check-permission`,
    rulesUser: (userId) => `${API_BASE_URL}/api/rules/user/${userId}`,
    rulesReset: `${API_BASE_URL}/api/rules/reset`,
};

export const API_BASE = API_BASE_URL;
