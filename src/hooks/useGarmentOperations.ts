
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '../types';

export const useGarmentOperations = (fetchGarments: () => Promise<void>) => {
  const { toast } = useToast();

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

  const markAsSold = async (garmentId: string, garmentName: string, garments: any[], suppliers: Supplier[], paymentType: string) => {
    try {
      // Get garment and supplier info for WhatsApp
      const garment = garments.find(g => g.id === garmentId);
      const supplier = suppliers.find(s => s.id === garment?.supplier_id);

      const { data, error } = await supabase
        .from('garments')
        .update({ 
          is_sold: true, 
          payment_status: 'pending',
          payment_type: paymentType,
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

      // Force immediate refresh
      await fetchGarments();
    } catch (error) {
      console.error('Exception marking as sold:', error);
      toast({
        title: "Error",
        description: "Error inesperado al marcar como vendida",
        variant: "destructive",
      });
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

      // Force immediate refresh
      await fetchGarments();
    } catch (error) {
      console.error('Exception marking as paid:', error);
      toast({
        title: "Error",
        description: "Error inesperado al registrar pago",
        variant: "destructive",
      });
    }
  };

  return {
    markAsSold,
    markAsPaid
  };
};
