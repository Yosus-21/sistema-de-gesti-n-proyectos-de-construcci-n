import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../../shared/types/auth.types';
import { httpClient } from '../../shared/api/http-client';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: true,
  });

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const loadCurrentUser = useCallback(async () => {
    try {
      if (!state.accessToken) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      const user = await httpClient.get<User>('/auth/me');
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load user', error);
      logout();
    }
  }, [state.accessToken, logout]);

  useEffect(() => {
    if (state.accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCurrentUser();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.accessToken]);

  const login = (token: string, user: User) => {
    localStorage.setItem('accessToken', token);
    setState({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loadCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
