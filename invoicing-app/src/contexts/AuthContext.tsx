'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

interface AuthSession {
  userId: string;
  token: string;
  expiresAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users data (in production, this would be in a database)
  const mockUsers = [
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@invoicepro.com',
      password: 'Demo123', // In production, this would be hashed
      role: 'admin' as const,
      isActive: true
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user' as const,
      isActive: true
    }
  ];

  useEffect(() => {
    // Check for existing session on load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        return { success: false, message: 'Invalid email or password' };
      }

      if (!foundUser.isActive) {
        return { success: false, message: 'Account is deactivated' };
      }

      // Create user session
      const userSession: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isActive: foundUser.isActive
      };

      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));

      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        password: data.password, // In production, this would be hashed
        role: 'user' as const,
        isActive: true
      };

      // Add to mock users (in production, this would be saved to database)
      mockUsers.push(newUser);

      // Create user session
      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive
      };

      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}