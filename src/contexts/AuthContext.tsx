import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, User } from '@/services/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(userService.getCurrentUser());
  }, []);

  const login = (email: string, password: string) => {
    const u = userService.login(email, password);
    setUser(u);
  };

  const register = (email: string, password: string, name: string) => {
    const u = userService.register(email, password, name);
    setUser(u);
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
