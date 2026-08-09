import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGISTERED_USERS_KEY = 'intervai_registered_users';
const AUTH_USER_KEY = 'intervai_auth_user';
const AUTH_TOKEN_KEY = 'intervai_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize active session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load session from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRegisteredUsers = (): (User & { password: string })[] => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);

    const emailClean = payload.email.trim().toLowerCase();
    const registered = getRegisteredUsers();

    // Prevent Duplicate Emails
    const existing = registered.find(u => u.email.toLowerCase() === emailClean);
    if (existing) {
      setIsLoading(false);
      const msg = 'An account with this email already exists. Please log in.';
      setError(msg);
      throw new Error(msg);
    }

    const newUser: User & { password: string } = {
      id: `usr-${Date.now()}`,
      name: payload.fullName.trim(),
      email: emailClean,
      password: payload.password,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };

    registered.push(newUser);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }

    setIsLoading(false);
  };

  const login = async (payload: LoginPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);

    const emailClean = payload.email.trim().toLowerCase();
    const registered = getRegisteredUsers();

    // Check if account exists
    const found = registered.find(u => u.email.toLowerCase() === emailClean);
    if (!found) {
      setIsLoading(false);
      const msg = 'Account not found. Please register first.';
      setError(msg);
      throw new Error(msg);
    }

    // Validate Password
    if (found.password !== payload.password) {
      setIsLoading(false);
      const msg = 'Invalid password. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }

    // Create session
    const sessionUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.avatar,
      createdAt: found.createdAt
    };

    const mockToken = `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    } catch (e) {
      console.error('Failed to persist session', e);
    }

    setUser(sessionUser);
    setIsLoading(false);
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
