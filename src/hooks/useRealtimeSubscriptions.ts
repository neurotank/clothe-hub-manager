
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSubscriptions = (
  fetchSuppliers: () => Promise<void>,
  fetchGarments: () => Promise<void>
) => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  // Set up real-time subscriptions with proper cleanup
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions for user:', user.id);

    const setupRealtimeSubscription = async () => {
      try {
        // Clean up any existing channel
        if (channelRef.current) {
          console.log('Cleaning up existing channel');
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        // Create a new channel with a unique name
        const channelName = `db-changes-${user.id}-${Date.now()}`;
        console.log('Creating channel:', channelName);
        const channel = supabase.channel(channelName);
        
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'suppliers'
            },
            async (payload) => {
              console.log('Suppliers real-time update:', payload);
              // Refresh suppliers data immediately
              await fetchSuppliers();
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'garments'
            },
            async (payload) => {
              console.log('Garments real-time update:', payload);
              // Refresh garments data immediately
              await fetchGarments();
            }
          )
          .subscribe((status) => {
            console.log('Real-time subscription status:', status);
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      console.log('Cleaning up real-time subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, fetchSuppliers, fetchGarments]);
};
