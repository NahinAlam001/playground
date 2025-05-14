
"use client";
import type { User } from '@/types';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (type: 'email' | 'google' | 'github', email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email?: string, password?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state on mount
    const storedUser = localStorage.getItem('profileForgeMockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (type: 'email' | 'google' | 'github', email?: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    const mockUser: User = {
      uid: 'mock-uid-' + type + '-' + Math.random().toString(16).slice(2),
      displayName: type === 'google' ? 'Google User' : type === 'github' ? 'GitHub User' : email?.split('@')[0] || 'User',
      email: email || type + '@example.com',
      photoURL: `https://placehold.co/40x40.png?text=${(type === 'email' && email ? email[0] : type[0]).toUpperCase()}`,
    };
    localStorage.setItem('profileForgeMockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('profileForgeMockUser');
    setUser(null);
    setLoading(false);
  };
  
  const register = async (email?: string): Promise<void> => {
    // Simulate registration then login
    await login('email', email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

