import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth context is null/undefined');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        try {
          apiService.setToken(savedToken);
          const response = await apiService.get('/user/profile');
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          localStorage.removeItem('auth_token');
          apiService.setToken('');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (usernameOrPhone: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.post('/auth/login', {
        usernameOrPhone,
        password
      });

      const { token: authToken, user: userData } = response.data;
      
      if (userData.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        return false;
      }

      localStorage.setItem('auth_token', authToken);
      apiService.setToken(authToken);
      setToken(authToken);
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.fullName}!`);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiService.setToken('');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;