import { useContext } from 'react';
import { AuthContext } from '../providers/auth-provider';
import type { AuthContextType } from '../types';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth();
  
  return {
    user,
    hasPermission,
    hasRole,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
  };
}

export function useAuthGuard(requiredPermissions?: { resource: string; action: string }[]) {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  
  const hasRequiredPermissions = requiredPermissions
    ? requiredPermissions.every(perm => hasPermission(perm.resource, perm.action))
    : true;
  
  return {
    isAuthenticated,
    isLoading,
    isAuthorized: isAuthenticated && hasRequiredPermissions,
    user,
    canAccess: isAuthenticated && hasRequiredPermissions,
  };
}