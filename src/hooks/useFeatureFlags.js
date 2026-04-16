import { useRules } from '../context/RulesContext';

export const useFeatureFlags = () => {
  const { isFeatureEnabled, featureFlags, actions } = useRules();

  const checkFeature = (feature) => {
    return isFeatureEnabled(feature);
  };

  const toggleFeature = async (feature, value) => {
    try {
      actions.updateFeatureFlag(feature, value);
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      throw error;
    }
  };

  const getAllFeatures = () => {
    return featureFlags;
  };

  const isChatEnabled = () => checkFeature('chat_enabled');
  const isVideoCallsEnabled = () => checkFeature('video_calls_enabled');
  const isAdvancedAnalyticsEnabled = () => checkFeature('advanced_analytics');
  const isCollaborativeLearningEnabled = () => checkFeature('collaborative_learning');
  const isGamificationEnabled = () => checkFeature('gamification');

  return {
    checkFeature,
    toggleFeature,
    getAllFeatures,
    isChatEnabled,
    isVideoCallsEnabled,
    isAdvancedAnalyticsEnabled,
    isCollaborativeLearningEnabled,
    isGamificationEnabled,
    featureFlags
  };
};

