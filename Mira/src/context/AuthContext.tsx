import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'merchant' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  institution?: string;
  businessName?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsStudent: (email: string) => void;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  refreshToken: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
  phone: string;
  institution?: string;
  businessName?: string;
  businessCategory?: string;
  partnerID?: string;
  accountNumber?: string;
  bankCode?: string;
  accountName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and refresh token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('mira_user');
        const token = localStorage.getItem('mira_token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await refreshToken();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('mira_user');
        localStorage.removeItem('mira_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app';
      const response = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      const admin = data.admin;
      const userRole: UserRole = admin.role === 'Mira_admin' || admin.role === 'college_admin' || admin.role === 'owner' ? 'admin' : 'student';

      const authUser: AuthUser = {
        id: String(admin.id),
        email: admin.email,
        name: admin.email,
        role: userRole,
      };

      setUser(authUser);
      localStorage.setItem('mira_token', data.token);
      localStorage.setItem('mira_admin_token', data.token);
      localStorage.setItem('mira_user', JSON.stringify(authUser));
      localStorage.setItem('isLoggedIn', 'true');
      if (admin.partnerIdentifier) {
        localStorage.setItem('adminCollege', admin.partnerIdentifier.toLowerCase());
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app';
      const response = await fetch(`${API_BASE}/api/admin/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerIdentifier: data.partnerID || data.name?.replace(/\s+/g, '').toUpperCase().slice(0, 10),
          partnerName: data.businessName || data.name,
          businessVertical: data.businessCategory || 'education',
          bankCode: data.bankCode || '000',
          accountNumber: data.accountNumber || '0000000000',
          accountName: data.accountName || data.name,
          ownerEmail: data.email,
          ownerPassword: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const result = await response.json();
      const userRole: UserRole = data.role === 'admin' ? 'admin' : 'student';

      const authUser: AuthUser = {
        id: String(result.admin?.id || result.id || Date.now()),
        email: data.email,
        name: data.name,
        role: userRole,
      };

      setUser(authUser);
      localStorage.setItem('mira_user', JSON.stringify(authUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mira_token');
    localStorage.removeItem('mira_admin_token');
    localStorage.removeItem('mira_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminCollege');
  };

  const loginAsStudent = (email: string) => {
    const authUser: AuthUser = {
      id: `student_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'student',
    };
    setUser(authUser);
    localStorage.setItem('mira_user', JSON.stringify(authUser));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const token = localStorage.getItem('mira_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Profile update failed');

      const result = await response.json();
      setUser(result.user);
      localStorage.setItem('mira_user', JSON.stringify(result.user));
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('mira_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/admin/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        logout();
        return;
      }

      const data = await response.json();
      localStorage.setItem('mira_token', data.token);
      localStorage.setItem('mira_admin_token', data.token);
    } catch (error) {
      logout();
    }
  };

  const resendVerification = async (email: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error('Failed to resend verification');
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Email verification failed');
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('mira_user', JSON.stringify(data.user));
  };

  const requestPasswordReset = async (email: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error('Password reset request failed');
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mira-production-6a48.up.railway.app'}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });

    if (!response.ok) throw new Error('Password reset failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        loginAsStudent,
        signup,
        logout,
        updateProfile,
        refreshToken,
        resendVerification,
        verifyEmail,
        resetPassword,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
