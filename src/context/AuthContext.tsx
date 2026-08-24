import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CustomerProfile, StaffProfile, UserRole } from '../types/database.js';

interface AuthContextType {
  user: User | null;
  customerProfile: CustomerProfile | null;
  staffProfile: StaffProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; companyName?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'admin' | 'sales' | 'tech' | 'shop' | 'customer1' | 'customer2') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setCustomerProfile(data.customerProfile || null);
        setStaffProfile(data.staffProfile || null);
      } else {
        setUser(null);
        setCustomerProfile(null);
        setStaffProfile(null);
      }
    } catch (err) {
      console.error('Failed to fetch me:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      await fetchCurrentUser();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (regData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      await fetchCurrentUser();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setCustomerProfile(null);
    setStaffProfile(null);
  };

  const switchDemoRole = async (roleKey: 'admin' | 'sales' | 'tech' | 'shop' | 'customer1' | 'customer2') => {
    const creds: Record<string, { email: string; pass: string }> = {
      admin: { email: 'admin@digitalinstall-et.com', pass: 'admin123' },
      sales: { email: 'sales@digitalinstall-et.com', pass: 'sales123' },
      tech: { email: 'tech@digitalinstall-et.com', pass: 'tech123' },
      shop: { email: 'shop@digitalinstall-et.com', pass: 'shop123' },
      customer1: { email: 'customer@horizon-et.com', pass: 'cust123' },
      customer2: { email: 'customer2@grandmall.et', pass: 'cust123' }
    };

    const target = creds[roleKey];
    if (target) {
      await login(target.email, target.pass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        staffProfile,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
