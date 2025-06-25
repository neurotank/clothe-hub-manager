
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import SellConfirmDialog from '../components/SellConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import MonthFilter from '../components/MonthFilter';
import { useSupabaseData } from '../hooks/useSupabaseData';

const SupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    suppliers,
    getGarmentsBySupplier,
    markAsSold,
    markAsPaid,
    deleteGarment,
    loading
  } = useSupabaseData();
  
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const [sellDialog, setSellDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const supplier = suppliers.find(s => s.id === id);
  const allGarments = id ? getGarmentsBySupplier(id) : [];

  const filteredGarments = selectedMonth
    ? allGarments.filter(garment => {
        const garmentDate = new Date(garment.created_at);
        const [year, month] = selectedMonth.split('-');
        return garmentDate.getFullYear() === parseInt(year) && 
               garmentDate.getMonth() === parseInt(month) - 1;
      })
    : allGarments;

  const handleSellClick = (garmentId: string, garmentName: string) => {
    setSellDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleSellConfirm = async () => {
    if (!sellDialog.garmentId) return;
    await markAsSold(sellDialog.garmentId, sellDialog.garmentName);
    setSellDialog({ open: false, garmentId: null, garmentName: '' });
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
    await deleteGarment(deleteDialog.garmentId);
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
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
    await markAsPaid(paymentDialog.garmentId);
    setPaymentDialog({ open: false, garmentId: null, garmentName: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Proveedor no encontrado</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SupplierInfo supplier={supplier} />
          
          <div className="bg-white shadow-sm rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Prendas</h2>
                  <p className="text-gray-600 mt-1">
                    {filteredGarments.length} prendas encontradas
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <MonthFilter
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                  />
                  <Button
                    onClick={() => setIsAddGarmentOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Prenda
                  </Button>
                </div>
              </div>
            </div>
            
            <GarmentsTable
              garments={filteredGarments}
              onMarkAsSold={handleSellClick}
              onMarkAsPaid={handlePaymentClick}
              onDelete={handleDeleteClick}
              supplier={supplier}
            />
          </div>
        </div>
      </main>

      <AddGarmentModal
        isOpen={isAddGarmentOpen}
        onClose={() => setIsAddGarmentOpen(false)}
        supplierId={id!}
      />

      <SellConfirmDialog
        open={sellDialog.open}
        onOpenChange={(open) => setSellDialog(prev => ({ ...prev, open }))}
        onConfirm={handleSellConfirm}
        garmentName={sellDialog.garmentName}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.garmentName}
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
