// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  account: string | null;
  setAccount: (account: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('paaskeeper_token');
    const storedAccount = localStorage.getItem('paaskeeper_wallet');

    if (token && storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('paaskeeper_token');
    localStorage.removeItem('paaskeeper_wallet');
    setAccount(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ account, setAccount, isAuthenticated: !!account, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
