import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  role: 'patient' | 'doctor' | 'staff';
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  switchRole: (newRole: 'patient' | 'doctor' | 'staff') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_doc_01',
    email: 'doctor@hospital.in',
    full_name: 'Dr. Priya Sharma',
    role: 'doctor',
    is_active: true
  });
  const [role, setRole] = useState<'patient' | 'doctor' | 'staff'>('doctor');
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  const switchRole = (newRole: 'patient' | 'doctor' | 'staff') => {
    setRole(newRole);
    if (newRole === 'doctor') {
      setUser({
        id: 'usr_doc_01',
        email: 'doctor@hospital.in',
        full_name: 'Dr. Priya Sharma (Cardiology)',
        role: 'doctor',
        is_active: true
      });
    } else if (newRole === 'staff') {
      setUser({
        id: 'usr_staff_01',
        email: 'staff@hospital.in',
        full_name: 'Sister Ananya Rao (Triage Nurse)',
        role: 'staff',
        is_active: true
      });
    } else {
      setUser({
        id: 'usr_pat_01',
        email: 'rahul.kumar@gmail.com',
        full_name: 'Rahul Kumar',
        role: 'patient',
        is_active: true
      });
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password: pass });
      localStorage.setItem('auth_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setRole(res.user.role);
    } catch (e) {
      console.warn('Fallback local demo login:', e);
      // Auto fallback to demo user
      if (email.includes('doctor')) switchRole('doctor');
      else if (email.includes('staff')) switchRole('staff');
      else switchRole('patient');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
