import { useRules } from '../context/RulesContext';

export const usePermissions = () => {
  const { hasPermission, canAccess, permissions } = useRules();

  const checkPermission = (userRole, permission) => {
    return hasPermission(userRole, permission);
  };

  const checkAccess = (userRole, requiredPermissions = []) => {
    return canAccess(userRole, requiredPermissions);
  };

  const getRolePermissions = (role) => {
    return permissions[role] || [];
  };

  const isAdmin = (userRole) => {
    return checkPermission(userRole, 'manage_users');
  };

  const canManageContent = (userRole) => {
    return checkPermission(userRole, 'manage_content');
  };

  const canWrite = (userRole) => {
    return checkPermission(userRole, 'write');
  };

  const canDelete = (userRole) => {
    return checkPermission(userRole, 'delete');
  };

  return {
    checkPermission,
    checkAccess,
    getRolePermissions,
    isAdmin,
    canManageContent,
    canWrite,
    canDelete,
    permissions
  };
};

