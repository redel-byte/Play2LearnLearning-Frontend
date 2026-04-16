import React from 'react';
import RulesManager from '../../components/RulesManager';

const RulesManagement = () => {
  const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || '{}');
    return user.role || 'guest';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rules Management</h1>
        <p className="mt-2 text-gray-600">
          Manage application permissions, feature flags, and content rules
        </p>
      </div>
      
      <RulesManager userRole={getUserRole()} />
    </div>
  );
};

export default RulesManagement;

