
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SellConfirmDialog from '../components/SellConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import { useToast } from '@/hooks/use-toast';
import { sendWhatsAppMessage } from '../utils/whatsappUtils';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, Garment, GarmentFormData } from '../types';

const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los diálogos
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const [sellDialog, setSellDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');

  // Cargar datos del supplier y sus prendas
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        // Cargar supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', id)
          .single();

        if (supplierError) {
          console.error('Error loading supplier:', supplierError);
          toast({
            title: "Error",
            description: "No se pudo cargar el proveedor",
            variant: "destructive",
          });
        } else {
          setSupplier(supplierData);
        }

        // Cargar prendas del supplier
        const { data: garmentsData, error: garmentsError } = await supabase
          .from('garments')
          .select('*')
          .eq('supplier_id', id);

        if (garmentsError) {
          console.error('Error loading garments:', garmentsError);
        } else {
          setGarments(garmentsData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [id, toast]);

  // Filtrar prendas basado en búsqueda y filtros
  const filteredGarments = useMemo(() => {
    return garments.filter(garment => {
      const matchesSearch = 
        garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'available' && !garment.is_sold) ||
        (statusFilter === 'sold' && garment.is_sold) ||
        (statusFilter === 'pending_payment' && garment.payment_status === 'pending') ||
        (statusFilter === 'paid' && garment.payment_status === 'paid');

      return matchesSearch && matchesStatus;
    });
  }, [garments, searchTerm, statusFilter]);

  const addGarment = async (supplierId: string, garmentData: GarmentFormData) => {
    try {
      const { data, error } = await supabase
        .from('garments')
        .insert({
          supplier_id: supplierId,
          ...garmentData,
          is_sold: false,
          payment_status: 'not_available',
          created_at: new Date().toISOString(),
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
      } else {
        setGarments(prev => [...prev, data]);
        toast({
          title: "Prenda agregada",
          description: `${data.name} agregada exitosamente`,
        });
      }
    } catch (error) {
      console.error('Error in addGarment:', error);
    }
  };

  const markAsSold = async (garmentId: string) => {
    try {
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
      } else {
        setGarments(prev => prev.map(g => g.id === garmentId ? data : g));
      }
    } catch (error) {
      console.error('Error in markAsSold:', error);
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
      } else {
        setGarments(prev => prev.map(g => g.id === garmentId ? data : g));
      }
    } catch (error) {
      console.error('Error in markAsPaid:', error);
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
      } else {
        setGarments(prev => prev.filter(g => g.id !== garmentId));
      }
    } catch (error) {
      console.error('Error in deleteGarment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proveedor no encontrado</h2>
            <Button onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkAsSoldClick = (garmentId: string, garmentName: string) => {
    setSellDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleSellConfirm = async () => {
    if (sellDialog.garmentId && supplier) {
      const garment = garments.find(g => g.id === sellDialog.garmentId);
      if (garment) {
        await markAsSold(sellDialog.garmentId);
        
        // Enviar mensaje de WhatsApp
        sendWhatsAppMessage(supplier, garment);
        
        toast({
          title: "Prenda vendida",
          description: `${sellDialog.garmentName} marcada como vendida y mensaje de WhatsApp enviado`,
        });
      }
    }
    setSellDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const handleMarkAsPaidClick = (garmentId: string, garmentName: string) => {
    setPaymentDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handlePaymentConfirm = async () => {
    if (paymentDialog.garmentId) {
      await markAsPaid(paymentDialog.garmentId);
      toast({
        title: "Pago confirmado",
        description: `${paymentDialog.garmentName} marcada como pagada`,
      });
    }
    setPaymentDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const handleDeleteClick = (garmentId: string, garmentName: string) => {
    setDeleteDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.garmentId) {
      await deleteGarment(deleteDialog.garmentId);
      toast({
        title: "Prenda eliminada",
        description: `${deleteDialog.garmentName} eliminada del inventario`,
      });
    }
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const availableGarments = garments.filter(g => !g.is_sold);
  const soldGarments = garments.filter(g => g.is_sold);
  const pendingPayment = garments.filter(g => g.payment_status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <SupplierInfo supplier={supplier} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Prendas en Consignación</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                {availableGarments.length} disponibles
              </span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                {soldGarments.length} vendidas
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                {pendingPayment.length} pago pendiente
              </span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            {id && <AddGarmentModal supplierId={id} onAddGarment={addGarment} />}
          </div>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              Inventario de Prendas 
              {filteredGarments.length !== garments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {garments.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {garments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No hay prendas registradas para este proveedor
                </p>
                {id && <AddGarmentModal supplierId={id} onAddGarment={addGarment} />}
              </div>
            ) : (
              <GarmentsTable 
                garments={filteredGarments}
                onMarkAsSold={handleMarkAsSoldClick}
                onMarkAsPaid={handleMarkAsPaidClick}
                onDelete={handleDeleteClick}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.garmentName}
      />

      <SellConfirmDialog
        open={sellDialog.open}
        onOpenChange={(open) => setSellDialog(prev => ({ ...prev, open }))}
        onConfirm={handleSellConfirm}
        garmentName={sellDialog.garmentName}
      />

      <PaymentConfirmDialog
        open={paymentDialog.open}
        onOpenChange={(open) => setPaymentDialog(prev => ({ ...prev, open }))}
        onConfirm={handlePaymentConfirm}
        garmentName={paymentDialog.garmentName}
      />
    </div>
  );
};

export default SupplierDetail;
