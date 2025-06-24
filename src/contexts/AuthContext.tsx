
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

// Usuarios fijos del sistema con contraseñas
const FIXED_USERS: (User & { password: string })[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@consignapp.com',
    name: 'Administrador',
    role: 'admin',
    password: 'admin123',
    auth_user_id: '550e8400-e29b-41d4-a716-446655440001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'vendedor1@consignapp.com',
    name: 'Vendedor 1',
    role: 'supplier',
    password: 'vendedor123',
    auth_user_id: '550e8400-e29b-41d4-a716-446655440002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'vendedor2@consignapp.com',
    name: 'Vendedor 2',
    role: 'supplier',
    password: 'vendedor456',
    auth_user_id: '550e8400-e29b-41d4-a716-446655440003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const foundUser = FIXED_USERS.find(u => u.id === savedUserId);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = FIXED_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUserId', foundUser.id);
      return { error: null };
    }
    return { error: new Error('Email o contraseña incorrectos') };
  };

  const loginWithGoogle = async () => {
    return { error: new Error('Google login no disponible') };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const isAdmin = user?.role === 'admin';
  const isSupplier = user?.role === 'supplier';

  return (
    <AuthContext.Provider value={{
      user,
      session: null,
      login,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      isAdmin,
      isSupplier
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
