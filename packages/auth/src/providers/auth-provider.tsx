import React, { createContext, useEffect, useState, ReactNode } from 'react';
import type { 
  AuthContextType, 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  User,
  AuthSession,
  AuthError 
} from '../types';
import { JWTService } from '../utils/jwt';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  apiBaseUrl?: string;
  storageKey?: string;
}

export function AuthProvider({ 
  children, 
  apiBaseUrl = '/api/auth',
  storageKey = 'auth-session'
}: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedSession = localStorage.getItem(storageKey);
        
        if (savedSession) {
          const session: AuthSession = JSON.parse(savedSession);
          
          // Check if token is expired
          if (JWTService.isTokenExpired(session.token)) {
            // Try to refresh token
            if (session.refreshToken) {
              await refreshSession();
            } else {
              // Clear expired session
              localStorage.removeItem(storageKey);
              setState(prev => ({ ...prev, isLoading: false }));
            }
          } else {
            // Token is still valid
            setState({
              user: session.user,
              session,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem(storageKey);
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: { code: 'INIT_ERROR', message: 'Failed to initialize authentication' }
        }));
      }
    };

    initializeAuth();
  }, [storageKey]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { user, token, refreshToken } = await response.json();
      
      const session: AuthSession = {
        user,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        issuedAt: new Date(),
      };

      localStorage.setItem(storageKey, JSON.stringify(session));

      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const authError: AuthError = {
        code: 'LOGIN_ERROR',
        message: error instanceof Error ? error.message : 'Login failed',
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));
      
      throw authError;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (state.session?.token) {
        await fetch(`${apiBaseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.session.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem(storageKey);
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      
      // Auto-login after registration if tokens are provided
      if (result.token) {
        const session: AuthSession = {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          issuedAt: new Date(),
        };

        localStorage.setItem(storageKey, JSON.stringify(session));

        setState({
          user: result.user,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      const authError: AuthError = {
        code: 'REGISTER_ERROR',
        message: error instanceof Error ? error.message : 'Registration failed',
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));
      
      throw authError;
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      if (!state.session?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${apiBaseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refreshToken: state.session.refreshToken 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const { user, token, refreshToken } = await response.json();
      
      const newSession: AuthSession = {
        user,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        issuedAt: new Date(),
      };

      localStorage.setItem(storageKey, JSON.stringify(newSession));

      setState(prev => ({
        ...prev,
        user,
        session: newSession,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      localStorage.removeItem(storageKey);
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: { code: 'REFRESH_ERROR', message: 'Session expired' },
      });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.session?.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiBaseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.session.token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    
    setState(prev => ({
      ...prev,
      user: updatedUser,
      session: prev.session ? { ...prev.session, user: updatedUser } : null,
    }));
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!state.session?.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiBaseUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.session.token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }
  };

  const enableTwoFactor = async (): Promise<string> => {
    if (!state.session?.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiBaseUrl}/2fa/enable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.session.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to enable two-factor authentication');
    }

    const { backupCodes } = await response.json();
    return backupCodes;
  };

  const disableTwoFactor = async (totpCode: string): Promise<void> => {
    if (!state.session?.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiBaseUrl}/2fa/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.session.token}`,
      },
      body: JSON.stringify({ totpCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to disable two-factor authentication');
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.user) return false;
    
    return state.user.permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!state.user) return false;
    
    return state.user.roles.includes(roleName);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshSession,
    updateProfile,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}