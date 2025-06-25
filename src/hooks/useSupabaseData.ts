
import { useState, useEffect } from 'react';
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

  // Obtener el user_id de la tabla users basado en el auth_user_id
  const getUserId = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
    
    return data?.id;
  };

  // Cargar proveedores
  const fetchSuppliers = async () => {
    const userId = await getUserId();
    if (!userId) return;

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      });
    } else {
      setSuppliers(data || []);
    }
  };

  // Cargar prendas
  const fetchGarments = async () => {
    const userId = await getUserId();
    if (!userId) return;

    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching garments:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las prendas",
        variant: "destructive",
      });
    } else {
      setGarments(data || []);
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchSuppliers(), fetchGarments()]);
        setLoading(false);
      };
      loadData();
    } else {
      setSuppliers([]);
      setGarments([]);
      setLoading(false);
    }
  }, [user]);

  const addSupplier = async (supplierData: SupplierFormData) => {
    const userId = await getUserId();
    if (!userId) return null;

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

    setSuppliers(prev => [...prev, data]);
    toast({
      title: "Éxito",
      description: "Proveedor agregado correctamente",
    });
    return data;
  };

  const addGarment = async (supplierId: string, garmentData: GarmentFormData) => {
    const userId = await getUserId();
    if (!userId) return;

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

    setGarments(prev => [...prev, data]);
    toast({
      title: "Éxito",
      description: "Prenda agregada correctamente",
    });
  };

  const markAsSold = async (garmentId: string) => {
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

    setGarments(prev => prev.map(garment => 
      garment.id === garmentId ? data : garment
    ));
    toast({
      title: "Éxito",
      description: "Prenda marcada como vendida",
    });
  };

  const markAsPaid = async (garmentId: string) => {
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

    setGarments(prev => prev.map(garment => 
      garment.id === garmentId ? data : garment
    ));
    toast({
      title: "Éxito",
      description: "Pago registrado correctamente",
    });
  };

  const deleteGarment = async (garmentId: string) => {
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

    setGarments(prev => prev.filter(garment => garment.id !== garmentId));
    toast({
      title: "Éxito",
      description: "Prenda eliminada correctamente",
    });
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
