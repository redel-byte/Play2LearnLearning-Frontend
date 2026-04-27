import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthenticatedUser } from '../api/auth';
import {
  clearStoredUser,
  getAuthToken,
  getStoredUser,
  getUserPrimaryRole,
  userHasAnyPermission,
} from '../api/userManagment';
import toast from 'react-hot-toast';

const getDefaultPathForRole = (role) => {
  if (role === 'teacher' || role === 'admin') {
    return '/private/my-quizzes';
  }

  return '/private/quiz-history';
};

const AuthGuard = ({
  children,
  requiredRole = null,
  requiredRoles = null,
  requiredPermissions = null,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const requiredRolesKey = (requiredRoles ?? []).join('|');
  const requiredPermissionsKey = (requiredPermissions ?? []).join('|');

  useEffect(() => {
    const checkAuth = async () => {
      setAuthorized(false);
      setLoading(true);

      const token = getAuthToken();
      const storedUser = getStoredUser();
      
      if (!token) {
        toast.error('Please login to access this page');
        setLoading(false);
        navigate('/auth/login', { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp < now) {
          toast.error('Session expired. Please login again');
          clearStoredUser();
          setLoading(false);
          navigate('/auth/login', { replace: true });
          return;
        }

        const refreshedUser = await fetchAuthenticatedUser();
        const currentUser = refreshedUser ?? storedUser?.user ?? null;

        if (!currentUser?.is_active && currentUser?.is_active !== undefined) {
          toast.error('Your account is inactive');
          clearStoredUser();
          setLoading(false);
          navigate('/auth/login', { replace: true });
          return;
        }

        const currentRole = getUserPrimaryRole(currentUser);
        const allowedRoles = requiredRoles?.length > 0
          ? requiredRoles
          : requiredRole
            ? [requiredRole]
            : [];

        const hasRoleAccess = allowedRoles.length === 0 || allowedRoles.includes(currentRole);
        const permissionRequirements = requiredPermissions ?? [];
        const hasPermissionAccess = permissionRequirements.length === 0
          || userHasAnyPermission(currentUser, permissionRequirements);

        if (!hasRoleAccess && !hasPermissionAccess) {
          toast.error('Access denied for your account type');
          setLoading(false);
          navigate(getDefaultPathForRole(currentRole), { replace: true });
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error('Invalid session. Please login again');
        clearStoredUser();
        setLoading(false);
        navigate('/auth/login', { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requiredRole, requiredRolesKey, requiredPermissionsKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return authorized ? children : null;
};

export default AuthGuard;

