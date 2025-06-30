
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useSuppliers = (getUserData: () => Promise<string | null>) => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

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
      
      // Force immediate refresh in case real-time doesn't work
      console.log('Forcing suppliers refresh after add');
      await fetchSuppliers();
      
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

  const editSupplier = async (supplierId: string, supplierData: { name: string; surname: string; phone: string }) => {
    try {
      console.log('Editing supplier:', supplierId, supplierData);

      const { data, error } = await supabase
        .from('suppliers')
        .update({
          name: supplierData.name,
          surname: supplierData.surname,
          phone: supplierData.phone,
        })
        .eq('id', supplierId)
        .select()
        .single();

      if (error) {
        console.error('Error editing supplier:', error);
        toast({
          title: "Error",
          description: "No se pudo editar el proveedor",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Proveedor editado correctamente",
      });
      
      // Force immediate refresh
      await fetchSuppliers();
    } catch (error) {
      console.error('Exception editing supplier:', error);
      toast({
        title: "Error",
        description: "Error inesperado al editar proveedor",
        variant: "destructive",
      });
    }
  };

  const deleteSupplier = async (supplierId: string, garments: any[]) => {
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

      // Force immediate refresh
      await fetchSuppliers();
    } catch (error) {
      console.error('Exception deleting supplier:', error);
      toast({
        title: "Error",
        description: "Error inesperado al eliminar proveedor",
        variant: "destructive",
      });
    }
  };

  return {
    suppliers,
    setSuppliers,
    fetchSuppliers,
    addSupplier,
    editSupplier,
    deleteSupplier
  };
};
