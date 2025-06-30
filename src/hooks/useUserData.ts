
import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get user ID and role from users table
  const getUserData = useCallback(async () => {
    if (!user) {
      console.log('No user found');
      return null;
    }
    
    try {
      console.log('Getting user data for auth user:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error getting user data:', error);
        return null;
      }
      
      console.log('Found user data:', data);
      if (data) {
        setUserRole(data.role);
      }
      return data?.id || null;
    } catch (error) {
      console.error('Exception getting user data:', error);
      return null;
    }
  }, [user]);

  return {
    userRole,
    setUserRole,
    getUserData
  };
};
