import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useAppDispatch } from '@/hooks';
import { fetchCurrentUser } from '@/features/auth/authSlice';
import { LoadingSpinner } from '../ui';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user, try to fetch the current user
    if (token && !isAuthenticated && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [token, isAuthenticated, isLoading, dispatch]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated && !token) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
