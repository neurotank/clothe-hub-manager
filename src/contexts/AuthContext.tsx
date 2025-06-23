
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Configurar listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Obtener datos del usuario desde la tabla users
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          if (userData && !error) {
            setUser(userData);
            console.log('User data loaded:', userData);
          } else {
            console.error('Error loading user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    return { error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
    }
    setUser(null);
    setSession(null);
  };

  const isAdmin = user?.role === 'admin';
  const isSupplier = user?.role === 'supplier';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      loginWithGoogle,
      logout,
      isAuthenticated: !!session && !!user,
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
