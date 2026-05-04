import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, LoginResponse } from '../../shared/types/auth.types';
import { httpClient } from '../../shared/api/http-client';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const loadCurrentUser = async () => {
    try {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const userData = await httpClient.get<User>('/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Error loading current user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const login = async (credentials: LoginRequest) => {
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    setAccessToken(response.accessToken);
    setUser(response.user);
    localStorage.setItem('accessToken', response.accessToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
