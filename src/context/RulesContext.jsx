import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  permissions: {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_content', 'manage_rules'],
    teacher: ['read', 'write', 'manage_content', 'view_analytics'],
    student: ['read', 'submit_content', 'view_progress'],
    guest: ['read']
  },
  featureFlags: {
    chat_enabled: true,
    video_calls_enabled: false,
    advanced_analytics: false,
    collaborative_learning: true,
    gamification: true
  },
  contentRules: {
    max_file_size: 10485760,
    allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    profanity_filter: true,
    content_moderation: true
  },
  learningRules: {
    max_daily_hours: 8,
    required_completion_rate: 80,
    unlock_next_lesson: true,
    allow_skipping: false,
    retry_attempts: 3
  },
  userRules: {},
  loading: false,
  error: null
};

const RULES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PERMISSIONS: 'SET_PERMISSIONS',
  SET_FEATURE_FLAGS: 'SET_FEATURE_FLAGS',
  SET_CONTENT_RULES: 'SET_CONTENT_RULES',
  SET_LEARNING_RULES: 'SET_LEARNING_RULES',
  SET_USER_RULES: 'SET_USER_RULES',
  UPDATE_FEATURE_FLAG: 'UPDATE_FEATURE_FLAG',
  UPDATE_PERMISSION: 'UPDATE_PERMISSION',
  RESET_RULES: 'RESET_RULES'
};

const rulesReducer = (state, action) => {
  switch (action.type) {
    case RULES_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case RULES_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case RULES_ACTIONS.SET_PERMISSIONS:
      return { ...state, permissions: action.payload, loading: false };
    
    case RULES_ACTIONS.SET_FEATURE_FLAGS:
      return { ...state, featureFlags: action.payload, loading: false };
    
    case RULES_ACTIONS.SET_CONTENT_RULES:
      return { ...state, contentRules: action.payload, loading: false };
    
    case RULES_ACTIONS.SET_LEARNING_RULES:
      return { ...state, learningRules: action.payload, loading: false };
    
    case RULES_ACTIONS.SET_USER_RULES:
      return { ...state, userRules: action.payload, loading: false };
    
    case RULES_ACTIONS.UPDATE_FEATURE_FLAG:
      return {
        ...state,
        featureFlags: {
          ...state.featureFlags,
          [action.payload.key]: action.payload.value
        }
      };
    
    case RULES_ACTIONS.UPDATE_PERMISSION:
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.payload.role]: action.payload.permissions
        }
      };
    
    case RULES_ACTIONS.RESET_RULES:
      return initialState;
    
    default:
      return state;
  }
};

const RulesContext = createContext();

export const RulesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rulesReducer, initialState);

  const hasPermission = (role, permission) => {
    return state.permissions[role]?.includes(permission) || false;
  };

  const canAccess = (userRole, requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    
    const userPermissions = state.permissions[userRole] || [];
    return requiredPermissions.every(perm => userPermissions.includes(perm));
  };

  const isFeatureEnabled = (feature) => {
    return state.featureFlags[feature] || false;
  };

  const validateContent = (content) => {
    const rules = state.contentRules;
    const validation = {
      isValid: true,
      errors: []
    };

    if (content.fileSize && content.fileSize > rules.max_file_size) {
      validation.isValid = false;
      validation.errors.push(`File size exceeds maximum allowed size of ${rules.max_file_size / 1024 / 1024}MB`);
    }

    if (content.fileType && !rules.allowed_file_types.includes(content.fileType.toLowerCase())) {
      validation.isValid = false;
      validation.errors.push(`File type ${content.fileType} is not allowed`);
    }

    return validation;
  };

  const canProceedToNext = (userProgress) => {
    const rules = state.learningRules;
    
    if (rules.required_completion_rate > 0 && userProgress.completionRate < rules.required_completion_rate) {
      return {
        canProceed: false,
        reason: `Completion rate of ${rules.required_completion_rate}% is required`
      };
    }

    return { canProceed: true };
  };

  const actions = {
    setLoading: (loading) => dispatch({ type: RULES_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: RULES_ACTIONS.SET_ERROR, payload: error }),
    
    updateFeatureFlag: (key, value) => {
      dispatch({ type: RULES_ACTIONS.UPDATE_FEATURE_FLAG, payload: { key, value } });
    },
    
    updatePermissions: (role, permissions) => {
      dispatch({ type: RULES_ACTIONS.UPDATE_PERMISSION, payload: { role, permissions } });
    },

    fetchRules: async () => {
      dispatch({ type: RULES_ACTIONS.SET_LOADING, payload: true });
      try {
        dispatch({ type: RULES_ACTIONS.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({ type: RULES_ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    resetRules: () => dispatch({ type: RULES_ACTIONS.RESET_RULES })
  };

  const value = {
    ...state,
    hasPermission,
    canAccess,
    isFeatureEnabled,
    validateContent,
    canProceedToNext,
    actions
  };

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = () => {
  const context = useContext(RulesContext);
  if (!context) {
    throw new Error('useRules must be used within a RulesProvider');
  }
  return context;
};

export default RulesContext;

