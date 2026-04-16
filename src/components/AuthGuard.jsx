import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getPrimaryRole, getStoredUser } from '../api/userManagment';
import toast from 'react-hot-toast';

const AuthGuard = ({ children, requiredRole = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
        const token = getAuthToken();
        const storedUser = getStoredUser();
      
        if (!token) {
          toast.error('Please login to access this page');
        navigate('/auth/login');
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp < now) {
          toast.error('Session expired. Please login again');
          localStorage.clear();
          sessionStorage.clear();
          navigate('/auth/login');
          return;
        }

        if (!storedUser?.user?.is_active && storedUser?.user?.is_active !== undefined) {
          toast.error('Your account is inactive');
          localStorage.clear();
          sessionStorage.clear();
          navigate('/auth/login');
          return;
        }

        const currentRole = getPrimaryRole();
        if (requiredRole && currentRole !== requiredRole) {
          toast.error(`Access denied. ${requiredRole} role required`);
          navigate('/private/profile');
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error('Invalid session. Please login again');
        localStorage.clear();
        sessionStorage.clear();
        navigate('/auth/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

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

