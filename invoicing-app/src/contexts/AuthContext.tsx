'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataStore, AuthSession } from '../lib/dataStore';

interface AuthContextType {
  user: AuthSession | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: { email: string; name: string; password: string; confirmPassword: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      const { valid, session } = dataStore.validateSession(token);
      if (valid && session) {
        setUser(session);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = dataStore.loginUser(email, password);
      
      if (result.success && result.session) {
        setUser(result.session);
        localStorage.setItem('auth_token', result.session.token);
      }
      
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: { 
    email: string; 
    name: string; 
    password: string; 
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Validate required fields
      if (!userData.email || !userData.name || !userData.password) {
        return { success: false, message: 'All fields are required' };
      }

      // Validate name length
      if (userData.name.trim().length < 2) {
        return { success: false, message: 'Name must be at least 2 characters long' };
      }

      const result = dataStore.registerUser({
        email: userData.email,
        name: userData.name.trim(),
        password: userData.password,
        role: 'viewer', // Default role for new registrations
      });

      if (result.success) {
        // Auto-login after successful registration
        const loginResult = dataStore.loginUser(userData.email, userData.password);
        if (loginResult.success && loginResult.session) {
          setUser(loginResult.session);
          localStorage.setItem('auth_token', loginResult.session.token);
        }
      }

      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dataStore.logoutUser(token);
      localStorage.removeItem('auth_token');
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};