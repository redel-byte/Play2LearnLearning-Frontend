import React, { useState } from 'react';
import { useRules } from '../context/RulesContext';
import { usePermissions } from '../hooks/usePermissions';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useContentRules } from '../hooks/useContentRules';

const RulesManager = ({ userRole }) => {
  const { 
    permissions, 
    featureFlags, 
    contentRules, 
    learningRules, 
    actions 
  } = useRules();
  
  const { isAdmin } = usePermissions();
  const { toggleFeature } = useFeatureFlags();
  const { getMaxFileSizeFormatted, getAllowedFileTypesString } = useContentRules();
  
  const [activeTab, setActiveTab] = useState('permissions');
  const [loading, setLoading] = useState(false);

  if (!isAdmin(userRole)) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">Access Denied</h3>
        <p className="text-red-600">You don't have permission to manage rules.</p>
      </div>
    );
  }

  const handleFeatureToggle = async (feature, value) => {
    setLoading(true);
    try {
      await toggleFeature(feature, value);
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (role, permission) => {
    const currentPermissions = permissions[role] || [];
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    
    actions.updatePermissions(role, updatedPermissions);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Rules Management</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['permissions', 'features', 'content', 'learning'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Role Permissions</h3>
          {Object.entries(permissions).map(([role, rolePermissions]) => (
            <div key={role} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 capitalize">{role} Permissions</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['read', 'write', 'delete', 'manage_users', 'manage_content', 'manage_rules'].map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={rolePermissions.includes(permission)}
                      onChange={() => handlePermissionChange(role, permission)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{permission.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Feature Flags</h3>
          {Object.entries(featureFlags).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium capitalize">{feature.replace('_', ' ')}</span>
                <p className="text-sm text-gray-600">
                  {enabled ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
              <button
                onClick={() => handleFeatureToggle(feature, !enabled)}
                disabled={loading}
                aria-label={`Toggle ${feature.replace('_', ' ')} ${enabled ? 'off' : 'on'}`}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">File Upload Limits</h4>
              <p className="text-sm text-gray-600">
                Max file size: <span className="font-medium">{getMaxFileSizeFormatted()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Allowed types: <span className="font-medium">{getAllowedFileTypesString()}</span>
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Content Moderation</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentRules.profanity_filter}
                  onChange={(e) => actions.updateFeatureFlag('profanity_filter', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Enable profanity filter</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={contentRules.content_moderation}
                  onChange={(e) => actions.updateFeatureFlag('content_moderation', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Enable content moderation</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Learning Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Progress Requirements</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Max daily learning hours</label>
                  <input
                    type="number"
                    value={learningRules.max_daily_hours}
                    onChange={(e) => actions.updateFeatureFlag('max_daily_hours', parseInt(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Required completion rate (%)</label>
                  <input
                    type="number"
                    value={learningRules.required_completion_rate}
                    onChange={(e) => actions.updateFeatureFlag('required_completion_rate', parseInt(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Learning Flow</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={learningRules.unlock_next_lesson}
                    onChange={(e) => actions.updateFeatureFlag('unlock_next_lesson', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Unlock next lesson automatically</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={learningRules.allow_skipping}
                    onChange={(e) => actions.updateFeatureFlag('allow_skipping', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Allow skipping lessons</span>
                </label>
                <div>
                  <label className="text-sm text-gray-600">Max retry attempts</label>
                  <input
                    type="number"
                    value={learningRules.retry_attempts}
                    onChange={(e) => actions.updateFeatureFlag('retry_attempts', parseInt(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesManager;

