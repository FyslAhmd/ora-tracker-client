import { useAppSelector } from './useRedux';
import { UserRole } from '@/types';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const isAdmin = user?.role === 'admin';
  const isInspector = user?.role === 'inspector';
  const isViewer = user?.role === 'viewer';

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canCreate = hasRole(['admin', 'inspector']);
  const canEdit = hasRole(['admin', 'inspector']);
  const canDelete = hasRole(['admin']);
  const canManageUsers = hasRole(['admin']);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isInspector,
    isViewer,
    hasRole,
    canCreate,
    canEdit,
    canDelete,
    canManageUsers,
  };
};
