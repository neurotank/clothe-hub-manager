
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

// Usuarios fijos del sistema
const FIXED_USERS: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@consignapp.com',
    name: 'Administrador',
    role: 'admin',
    auth_user_id: '550e8400-e29b-41d4-a716-446655440001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'vendedor1@consignapp.com',
    name: 'Vendedor 1',
    role: 'supplier',
    auth_user_id: '550e8400-e29b-41d4-a716-446655440002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'vendedor2@consignapp.com',
    name: 'Vendedor 2',
    role: 'supplier',
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
        setUser(foundUser);
      }
    } else {
      // Por defecto, loguear como admin
      setUser(FIXED_USERS[0]);
      localStorage.setItem('currentUserId', FIXED_USERS[0].id);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = FIXED_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUserId', foundUser.id);
      return { error: null };
    }
    return { error: new Error('Usuario no encontrado') };
  };

  const loginWithGoogle = async () => {
    // No implementado para usuarios fijos
    return { error: new Error('Google login no disponible') };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const switchUser = (userId: string) => {
    const foundUser = FIXED_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUserId', foundUser.id);
    }
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
      switchUser,
      isAuthenticated: !!user,
      isAdmin,
      isSupplier,
      availableUsers: FIXED_USERS
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
