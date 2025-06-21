
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios predefinidos
const USERS: Array<User & { password: string }> = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrador' },
  { id: 2, username: 'vendedor1', password: 'venta123', name: 'Vendedor 1' },
  { id: 3, username: 'vendedor2', password: 'venta456', name: 'Vendedor 2' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    console.log('Attempting login for:', username);
    const foundUser = USERS.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userSession = { id: foundUser.id, username: foundUser.username, name: foundUser.name };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      console.log('Login successful for:', foundUser.name);
      return true;
    }
    
    console.log('Login failed for:', username);
    return false;
  };

  const logout = () => {
    console.log('User logged out');
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
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
