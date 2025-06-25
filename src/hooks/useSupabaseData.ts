import { useState, useEffect, useCallback } from 'react';
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

  // Get user ID from users table
  const getUserId = useCallback(async () => {
    if (!user) {
      console.log('No user found');
      return null;
    }
    
    try {
      console.log('Getting user ID for auth user:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error getting user ID:', error);
        return null;
      }
      
      console.log('Found user by auth_user_id:', data);
      return data?.id || null;
    } catch (error) {
      console.error('Exception getting user ID:', error);
      return null;
    }
  }, [user]);

  // Load suppliers with error handling
  const fetchSuppliers = useCallback(async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('No user ID found, skipping suppliers fetch');
        setSuppliers([]);
        return;
      }

      console.log('Fetching suppliers for user:', userId);

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
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
  }, [getUserId, toast]);

  // Load garments with error handling
  const fetchGarments = useCallback(async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('No user ID found, skipping garments fetch');
        setGarments([]);
        return;
      }

      console.log('Fetching garments for user:', userId);

      const { data, error } = await supabase
        .from('garments')
        .select('*')
        .eq('user_id', userId)
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
  }, [getUserId, toast]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      console.log('User found, loading data...');
      const loadData = async () => {
        setLoading(true);
        try {
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
      setLoading(false);
    }
  }, [user, fetchSuppliers, fetchGarments]);

  // Set up real-time subscriptions - separate effect with stable dependencies
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions');

    // Create unique channel names to avoid conflicts
    const suppliersChannelName = `suppliers-changes-${user.id}`;
    const garmentsChannelName = `garments-changes-${user.id}`;

    // Suppliers real-time subscription
    const suppliersChannel = supabase
      .channel(suppliersChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suppliers'
        },
        (payload) => {
          console.log('Suppliers real-time update:', payload);
          fetchSuppliers();
        }
      )
      .subscribe();

    // Garments real-time subscription
    const garmentsChannel = supabase
      .channel(garmentsChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'garments'
        },
        (payload) => {
          console.log('Garments real-time update:', payload);
          fetchGarments();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(suppliersChannel);
      supabase.removeChannel(garmentsChannel);
    };
  }, [user?.id]); // Only depend on user.id to avoid recreating channels

  const addSupplier = async (supplierData: SupplierFormData) => {
    try {
      const userId = await getUserId();
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

  const addGarment = async (supplierId: string, garmentData: GarmentFormData) => {
    try {
      const userId = await getUserId();
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
    addSupplier,
    addGarment,
    markAsSold,
    markAsPaid,
    deleteGarment,
    getGarmentsBySupplier,
    getAllSoldGarments
  };
};
