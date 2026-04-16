import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

const ProtectedRoute = ({ 
  children, 
  userRole, 
  requiredPermissions = [], 
  requiredFeatures = [],
  fallback = null 
}) => {
  const { checkAccess } = usePermissions();
  const { checkFeature } = useFeatureFlags();

  const hasPermissions = requiredPermissions.length === 0 || 
    checkAccess(userRole, requiredPermissions);

  const hasFeatures = requiredFeatures.length === 0 || 
    requiredFeatures.every(feature => checkFeature(feature));

  const canAccess = hasPermissions && hasFeatures;

  if (!canAccess) {
    return fallback || (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800">Access Restricted</h3>
        <p className="text-yellow-600">
          You don't have the required permissions or features are not enabled to access this content.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

