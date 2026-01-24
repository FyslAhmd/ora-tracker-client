import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';
import { Alert } from '../ui';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: 'redirect' | 'message';
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = 'redirect',
}) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    if (fallback === 'message') {
      return (
        <div className="p-6">
          <Alert variant="error" title="Access Denied">
            You do not have permission to access this page. Required role:{' '}
            {allowedRoles.join(' or ')}.
          </Alert>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
