
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import EditGarmentModal from '../components/EditGarmentModal';
import SellConfirmDialog from '../components/SellConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Garment } from '../types';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { suppliers, garments, loading, addGarment, updateGarment, deleteGarment, editGarment } = useSupabaseData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);
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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });
  
  const [editGarmentModal, setEditGarmentModal] = useState<{
    open: boolean;
    garment: Garment | null;
  }>({ open: false, garment: null });

  const supplier = suppliers.find(s => s.id === id);
  const supplierGarments = garments.filter(g => g.supplier_id === id);

  const filteredGarments = supplierGarments.filter(garment => {
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

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleSellClick = (garmentId: string, garmentName: string) => {
    setSellDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleSellConfirm = async () => {
    if (!sellDialog.garmentId) return;

    try {
      await updateGarment(sellDialog.garmentId, {
        is_sold: true,
        sold_at: new Date().toISOString(),
        payment_status: 'pending'
      });
      toast({
        title: "Prenda vendida",
        description: `${sellDialog.garmentName} marcada como vendida`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar la prenda como vendida",
        variant: "destructive",
      });
    }
    
    setSellDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const handlePaymentClick = (garmentId: string, garmentName: string) => {
    setPaymentDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handlePaymentConfirm = async () => {
    if (!paymentDialog.garmentId) return;

    try {
      await updateGarment(paymentDialog.garmentId, {
        payment_status: 'paid'
      });
      toast({
        title: "Pago confirmado",
        description: `Se ha confirmado el pago de ${paymentDialog.garmentName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar el pago de la prenda",
        variant: "destructive",
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
    if (!deleteDialog.garmentId) return;

    try {
      await deleteGarment(deleteDialog.garmentId);
      toast({
        title: "Prenda eliminada",
        description: `${deleteDialog.garmentName} eliminada del inventario`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la prenda",
        variant: "destructive",
      });
    }
    
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const handleEditClick = (garment: Garment) => {
    setEditGarmentModal({
      open: true,
      garment
    });
  };

  const handleEditGarment = async (garmentId: string, garmentData: any) => {
    try {
      await editGarment(garmentId, garmentData);
      toast({
        title: "Prenda editada",
        description: "La prenda se editó exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo editar la prenda",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Cargando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Proveedor no encontrado</CardTitle>
            </CardHeader>
            <CardContent>
              <p>El proveedor con ID {id} no existe.</p>
              <Button onClick={handleGoBack} className="mt-4">
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="md:w-1/2">
            <Button onClick={handleGoBack} variant="ghost" className="mb-4 md:mb-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <SupplierInfo supplier={supplier} />
          </div>
          <div className="md:w-1/2 md:text-right">
            <Button
              onClick={() => setIsAddGarmentOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Prenda
            </Button>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              Prendas del Proveedor
              {filteredGarments.length !== supplierGarments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {supplierGarments.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplierGarments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Este proveedor no tiene prendas registradas
                </p>
                <AddGarmentModal supplierId={id!} onAddGarment={addGarment} />
              </div>
            ) : (
              <>
                <SearchAndFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  searchPlaceholder="Buscar por código o nombre..."
                />
                
                <GarmentsTable 
                  garments={filteredGarments}
                  onMarkAsSold={handleSellClick}
                  onMarkAsPaid={handlePaymentClick}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                  supplier={supplier}
                />
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />

      <AddGarmentModal
        isOpen={isAddGarmentOpen}
        onClose={() => setIsAddGarmentOpen(false)}
        supplierId={id!}
        onAddGarment={addGarment}
      />

      <SellConfirmDialog
        open={sellDialog.open}
        onOpenChange={(open) => setSellDialog(prev => ({ ...prev, open }))}
        onConfirm={handleSellConfirm}
        itemName={sellDialog.garmentName}
      />

      <PaymentConfirmDialog
        open={paymentDialog.open}
        onOpenChange={(open) => setPaymentDialog(prev => ({ ...prev, open }))}
        onConfirm={handlePaymentConfirm}
        itemName={paymentDialog.garmentName}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.garmentName}
      />
      
      <EditGarmentModal
        open={editGarmentModal.open}
        onOpenChange={(open) => setEditGarmentModal(prev => ({ ...prev, open }))}
        garment={editGarmentModal.garment}
        onEditGarment={handleEditGarment}
      />
    </div>
  );
};

export default SupplierDetail;
