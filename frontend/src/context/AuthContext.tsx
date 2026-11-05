import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, LoginResponse } from '../services/api';
import { supabase, AuthSession } from '../services/supabaseClient';

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface AuthUser {
  authUserId: string;
  employeeId: string;
  role: UserRole;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  quickLogin: (role: UserRole) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth session on mount using shared browser Supabase client
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && isMounted) {
          const s = data.session;
          const userMeta = s.user.user_metadata || {};
          const resolvedUser: AuthUser = {
            authUserId: s.user.id,
            employeeId: s.user.employee_id || userMeta.employee_id || '',
            role: (s.user.role || userMeta.role || 'EMPLOYEE') as UserRole,
            email: s.user.email,
            name: userMeta.name || s.user.email.split('@')[0],
          };
          setUser(resolvedUser);
          setToken(s.access_token);
        } else if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('[AuthProvider] Failed to restore session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Subscribe to auth state changes without triggering full page reloads
    const { data: subData } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (session) {
        const userMeta = session.user.user_metadata || {};
        setUser({
          authUserId: session.user.id,
          employeeId: session.user.employee_id || userMeta.employee_id || '',
          role: (session.user.role || userMeta.role || 'EMPLOYEE') as UserRole,
          email: session.user.email,
          name: userMeta.name || session.user.email.split('@')[0],
        });
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      isMounted = false;
      subData.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const res: LoginResponse = await api.login(email, password);

      if (!res || !res.access_token || !res.user) {
        throw new Error('Authentication failed: Invalid response from server');
      }

      const resolvedUser: AuthUser = {
        authUserId: res.user.authUserId,
        employeeId: res.user.employeeId,
        role: res.user.role as UserRole,
        email: res.user.email,
        name: res.user.name,
      };

      // Persist session through shared browser Supabase client
      const session: AuthSession = {
        access_token: res.access_token,
        expires_at: Date.now() + 86400000,
        user: {
          id: resolvedUser.authUserId,
          email: resolvedUser.email,
          employee_id: resolvedUser.employeeId,
          role: resolvedUser.role,
          user_metadata: {
            name: resolvedUser.name,
            role: resolvedUser.role,
            employee_id: resolvedUser.employeeId,
          },
        },
      };

      supabase.auth.setSession(session);
      setUser(resolvedUser);
      setToken(res.access_token);
      return resolvedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: UserRole): Promise<AuthUser> => {
    const email =
      role === 'ADMIN'
        ? 'alex.rivera@workforce.example'
        : role === 'MANAGER'
        ? 'elena.rostova@workforce.example'
        : 'devansh.sharma@workforce.example';
    return await login(email, 'ApexPass2026!');
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !isLoading && !!user && !!token,
        isLoading,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
