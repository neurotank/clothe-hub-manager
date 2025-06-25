
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session loaded:', !!session);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session ? 'session exists' : 'no session');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle user profile creation/update
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            try {
              console.log('AuthProvider: Updating user profile for:', session.user.id);
              const { error } = await supabase
                .from('users')
                .upsert({ 
                  auth_user_id: session.user.id, 
                  email: session.user.email || '',
                  name: session.user.email || 'Usuario'
                }, { 
                  onConflict: 'auth_user_id' 
                });
              
              if (error) {
                console.error('AuthProvider: Error updating user profile:', error);
              } else {
                console.log('AuthProvider: User profile updated successfully');
              }
            } catch (error) {
              console.error('AuthProvider: Exception updating user profile:', error);
            }
          }, 100);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    setLoading(true);
    try {
      // Clear the local state first
      setSession(null);
      setUser(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Don't treat AuthSessionMissingError as a real error since it means we're already logged out
      if (error && error.message !== 'Auth session missing!') {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Successfully signed out');
      }
    } catch (error) {
      console.error('AuthProvider: Exception during sign out:', error);
      // Even if there's an error, we still want to clear the local state
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut
  };

  console.log('AuthProvider: Rendering with state - Loading:', loading, 'User:', !!user);

  return (
    <AuthContext.Provider value={value}>
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
