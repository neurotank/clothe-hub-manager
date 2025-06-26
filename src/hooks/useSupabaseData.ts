import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, Garment, GarmentFormData, SupplierFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

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

  // Load suppliers without user_id filtering - show all suppliers
  const fetchSuppliers = useCallback(async () => {
    try {
      console.log('Fetching all suppliers');

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching suppliers:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los proveedores",
          variant: "destructive",
        });
        setSuppliers([]);
      } else {
        console.log('Suppliers loaded:', data?.length || 0);
        setSuppliers(data || []);
      }
    } catch (error) {
      console.error('Exception fetching suppliers:', error);
      setSuppliers([]);
    }
  }, [toast]);

  // Load garments without user_id filtering - show all garments
  const fetchGarments = useCallback(async () => {
    try {
      console.log('Fetching all garments');

      const { data, error } = await supabase
        .from('garments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching garments:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las prendas",
          variant: "destructive",
        });
        setGarments([]);
      } else {
        console.log('Garments loaded:', data?.length || 0);
        setGarments(data || []);
      }
    } catch (error) {
      console.error('Exception fetching garments:', error);
      setGarments([]);
    }
  }, [toast]);

  // Load initial data
  useEffect(() => {
    if (user) {
      console.log('User found, loading initial data...');
      const loadData = async () => {
        setLoading(true);
        try {
          await getUserData();
          await Promise.all([fetchSuppliers(), fetchGarments()]);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      console.log('No user, clearing data...');
      setSuppliers([]);
      setGarments([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user?.id, fetchSuppliers, fetchGarments, getUserData]);

  // Set up real-time subscriptions with proper cleanup
  useEffect(() => {
    if (!user?.id || isSubscribedRef.current) return;

    console.log('Setting up real-time subscriptions for user:', user.id);

    const setupRealtimeSubscription = async () => {
      try {
        // Clean up any existing channel
        if (channelRef.current) {
          console.log('Cleaning up existing channel');
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        // Create a new channel
        const channel = supabase.channel(`db-changes-${user.id}-${Date.now()}`);
        
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
              try {
                const { data } = await supabase
                  .from('suppliers')
                  .select('*')
                  .order('name', { ascending: true });
                if (data) setSuppliers(data);
              } catch (error) {
                console.error('Error in suppliers real-time update:', error);
              }
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
              try {
                const { data } = await supabase
                  .from('garments')
                  .select('*')
                  .order('created_at', { ascending: false });
                if (data) setGarments(data);
              } catch (error) {
                console.error('Error in garments real-time update:', error);
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            }
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
      isSubscribedRef.current = false;
    };
  }, [user?.id]);

  const addSupplier = async (supplierData: SupplierFormData) => {
    try {
      const userId = await getUserData();
      if (!userId) {
        toast({
          title: "Error",
          description: "Usuario no encontrado",
          variant: "destructive",
        });
        return null;
      }

      console.log('Adding supplier:', supplierData);

      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          ...supplierData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding supplier:', error);
        toast({
          title: "Error",
          description: "No se pudo agregar el proveedor",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Éxito",
        description: "Proveedor agregado correctamente",
      });
      
      // The real-time subscription will handle the update
      return data;
    } catch (error) {
      console.error('Exception adding supplier:', error);
      toast({
        title: "Error",
        description: "Error inesperado al agregar proveedor",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteSupplier = async (supplierId: string) => {
    try {
      // First, check if supplier has any garments
      const garmentsBySupplier = garments.filter(garment => garment.supplier_id === supplierId);
      
      if (garmentsBySupplier.length > 0) {
        toast({
          title: "No se puede eliminar",
          description: "El proveedor tiene prendas asociadas. Elimine las prendas primero.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) {
        console.error('Error deleting supplier:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el proveedor",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      });

      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception deleting supplier:', error);
      toast({
        title: "Error",
        description: "Error inesperado al eliminar proveedor",
        variant: "destructive",
      });
    }
  };

  const addGarment = async (supplierId: string, garmentData: GarmentFormData) => {
    try {
      const userId = await getUserData();
      if (!userId) {
        toast({
          title: "Error",
          description: "Usuario no encontrado",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding garment:', garmentData);

      const { data, error } = await supabase
        .from('garments')
        .insert({
          ...garmentData,
          supplier_id: supplierId,
          user_id: userId,
          is_sold: false,
          payment_status: 'not_available',
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding garment:', error);
        toast({
          title: "Error",
          description: "No se pudo agregar la prenda",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Prenda agregada correctamente",
      });
      
      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception adding garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al agregar prenda",
        variant: "destructive",
      });
    }
  };

  const editGarment = async (garmentId: string, garmentData: any) => {
    try {
      console.log('Editing garment:', garmentId, garmentData);

      const { data, error } = await supabase
        .from('garments')
        .update({
          code: garmentData.code,
          name: garmentData.name,
          size: garmentData.size,
          purchase_price: garmentData.purchase_price,
          sale_price: garmentData.sale_price,
        })
        .eq('id', garmentId)
        .select()
        .single();

      if (error) {
        console.error('Error editing garment:', error);
        toast({
          title: "Error",
          description: "No se pudo editar la prenda",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Prenda editada correctamente",
      });
      
      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception editing garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al editar prenda",
        variant: "destructive",
      });
    }
  };

  const markAsSold = async (garmentId: string, garmentName: string) => {
    try {
      // Get garment and supplier info for WhatsApp
      const garment = garments.find(g => g.id === garmentId);
      const supplier = suppliers.find(s => s.id === garment?.supplier_id);

      const { data, error } = await supabase
        .from('garments')
        .update({ 
          is_sold: true, 
          payment_status: 'pending',
          sold_at: new Date().toISOString()
        })
        .eq('id', garmentId)
        .select()
        .single();

      if (error) {
        console.error('Error marking as sold:', error);
        toast({
          title: "Error",
          description: "No se pudo marcar como vendida",
          variant: "destructive",
        });
        return;
      }

      // Send WhatsApp message
      if (supplier && garment) {
        sendWhatsAppMessage(supplier, garment);
      }

      toast({
        title: "Éxito",
        description: "Prenda marcada como vendida",
      });

      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception marking as sold:', error);
      toast({
        title: "Error",
        description: "Error inesperado al marcar como vendida",
        variant: "destructive",
      });
    }
  };

  const sendWhatsAppMessage = (supplier: Supplier, garment: any) => {
    try {
      const cleanPhone = supplier.phone.replace(/\s/g, '');
      const fullPhone = `54${cleanPhone}`;
      
      const supplierName = `${supplier.name} ${supplier.surname}`;
      
      const message = `¡Hola ${supplierName}! 👋

Tu prenda "${garment.name}" se ha vendido exitosamente. 

💰 Podés pasar a retirar tu pago los martes y jueves de 18 a 20hs, sin excepción.

¡Gracias por confiar en nosotros!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  };

  const markAsPaid = async (garmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('garments')
        .update({ payment_status: 'paid' })
        .eq('id', garmentId)
        .select()
        .single();

      if (error) {
        console.error('Error marking as paid:', error);
        toast({
          title: "Error",
          description: "No se pudo marcar como pagada",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Pago registrado correctamente",
      });

      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception marking as paid:', error);
      toast({
        title: "Error",
        description: "Error inesperado al registrar pago",
        variant: "destructive",
      });
    }
  };

  const deleteGarment = async (garmentId: string) => {
    try {
      const { error } = await supabase
        .from('garments')
        .delete()
        .eq('id', garmentId);

      if (error) {
        console.error('Error deleting garment:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la prenda",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Prenda eliminada correctamente",
      });

      // The real-time subscription will handle the update
    } catch (error) {
      console.error('Exception deleting garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al eliminar prenda",
        variant: "destructive",
      });
    }
  };

  const getGarmentsBySupplier = (supplierId: string) => {
    return garments.filter(garment => garment.supplier_id === supplierId);
  };

  const getAllSoldGarments = () => {
    return garments.filter(garment => garment.is_sold);
  };

  return {
    suppliers,
    garments,
    loading,
    userRole,
    addSupplier,
    deleteSupplier,
    addGarment,
    editGarment,
    markAsSold,
    markAsPaid,
    deleteGarment,
    getGarmentsBySupplier,
    getAllSoldGarments
  };
};
