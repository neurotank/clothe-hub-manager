
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Garment, GarmentFormData, Supplier } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useGarments = (getUserData: () => Promise<string | null>) => {
  const { toast } = useToast();
  const [garments, setGarments] = useState<Garment[]>([]);

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
      
      // Force immediate refresh
      await fetchGarments();
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
      
      // Force immediate refresh
      await fetchGarments();
    } catch (error) {
      console.error('Exception editing garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al editar prenda",
        variant: "destructive",
      });
    }
  };

  const updateGarment = async (garmentId: string, updates: any) => {
    try {
      console.log('Updating garment:', garmentId, updates);

      const { data, error } = await supabase
        .from('garments')
        .update(updates)
        .eq('id', garmentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating garment:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la prenda",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Prenda actualizada correctamente",
      });
      
      // Force immediate refresh
      await fetchGarments();
    } catch (error) {
      console.error('Exception updating garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al actualizar prenda",
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

      // Force immediate refresh
      await fetchGarments();
    } catch (error) {
      console.error('Exception deleting garment:', error);
      toast({
        title: "Error",
        description: "Error inesperado al eliminar prenda",
        variant: "destructive",
      });
    }
  };

  return {
    garments,
    setGarments,
    fetchGarments,
    addGarment,
    editGarment,
    updateGarment,
    deleteGarment
  };
};
