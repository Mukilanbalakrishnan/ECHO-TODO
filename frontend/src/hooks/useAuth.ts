import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/localStorage';
import type { User } from '../types';

const AUTH_STORAGE_KEY = 'taskflow_isAuthenticated';
const USER_STORAGE_KEY = 'taskflow_user';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const authState = getStorageItem<boolean>(AUTH_STORAGE_KEY, false);
    const userState = getStorageItem<User | null>(USER_STORAGE_KEY, null);
    
    setIsAuthenticated(authState);
    setUser(userState);
    setIsLoaded(true);
  }, []);

  const login = async (username: string, password?: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: password || 'admin123' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const { user: dbUser } = await response.json();
      
      setIsAuthenticated(true);
      setUser(dbUser);
      
      setStorageItem(AUTH_STORAGE_KEY, true);
      setStorageItem(USER_STORAGE_KEY, dbUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    removeStorageItem(AUTH_STORAGE_KEY);
    removeStorageItem(USER_STORAGE_KEY);
    window.location.href = '/login';
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoaded,
  };
};
