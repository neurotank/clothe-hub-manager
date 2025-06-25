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
    if (!user) {
      console.log('No user found');
      return null;
    }
    
    console.log('Getting user ID for auth user:', user.id);
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error getting user ID:', error);
      // Si no se encuentra el usuario, intentar buscarlo por email
      const { data: emailData, error: emailError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (emailError) {
        console.error('Error getting user by email:', emailError);
        return null;
      }
      
      console.log('Found user by email:', emailData);
      return emailData?.id;
    }
    
    console.log('Found user by auth_user_id:', data);
    return data?.id;
  };

  // Cargar proveedores con orden alfabético
  const fetchSuppliers = async () => {
    const userId = await getUserId();
    if (!userId) {
      console.log('No user ID found, skipping suppliers fetch');
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
    } else {
      console.log('Suppliers loaded:', data);
      setSuppliers(data || []);
    }
  };

  // Cargar prendas ordenadas por fecha de creación (más reciente primero)
  const fetchGarments = async () => {
    const userId = await getUserId();
    if (!userId) {
      console.log('No user ID found, skipping garments fetch');
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
    } else {
      console.log('Garments loaded:', data);
      setGarments(data || []);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User found, loading data...');
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchSuppliers(), fetchGarments()]);
        setLoading(false);
      };
      loadData();
    } else {
      console.log('No user, clearing data...');
      setSuppliers([]);
      setGarments([]);
      setLoading(false);
    }
  }, [user]);

  const addSupplier = async (supplierData: SupplierFormData) => {
    const userId = await getUserId();
    if (!userId) return null;

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

    // Actualizar la lista ordenada alfabéticamente
    setSuppliers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    toast({
      title: "Éxito",
      description: "Proveedor agregado correctamente",
    });
    return data;
  };

  const addGarment = async (supplierId: string, garmentData: GarmentFormData) => {
    const userId = await getUserId();
    if (!userId) return;

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

    // Insertar al principio de la lista (más reciente primero)
    setGarments(prev => [data, ...prev]);
    toast({
      title: "Éxito",
      description: "Prenda agregada correctamente",
    });
  };

  const markAsSold = async (garmentId: string, garmentName: string) => {
    // Obtener la prenda y el proveedor para el WhatsApp
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

    setGarments(prev => prev.map(garment => 
      garment.id === garmentId ? data : garment
    ));

    // Enviar WhatsApp si tenemos los datos del proveedor
    if (supplier && garment) {
      sendWhatsAppMessage(supplier, garment);
    }

    toast({
      title: "Éxito",
      description: "Prenda marcada como vendida",
    });
  };

  const sendWhatsAppMessage = (supplier: Supplier, garment: any) => {
    // Limpiar el número de teléfono, eliminando espacios y agregando el código de país
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
