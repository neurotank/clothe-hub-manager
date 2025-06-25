
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../components/Header';
import GarmentsTable from '../components/GarmentsTable';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import MonthFilter from '../components/MonthFilter';
import { useSupabaseData } from '../hooks/useSupabaseData';

const AdminDashboard = () => {
  const {
    suppliers,
    getAllSoldGarments,
    markAsPaid,
    deleteGarment,
    loading
  } = useSupabaseData();
  
  const [selectedMonth, setSelectedMonth] = useState('');
  
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

  const allSoldGarments = getAllSoldGarments();

  const filteredGarments = selectedMonth
    ? allSoldGarments.filter(garment => {
        const soldDate = garment.sold_at ? new Date(garment.sold_at) : new Date(garment.created_at);
        const [year, month] = selectedMonth.split('-');
        return soldDate.getFullYear() === parseInt(year) && 
               soldDate.getMonth() === parseInt(month) - 1;
      })
    : allSoldGarments;

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

  // Calcular estadísticas
  const totalSales = filteredGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalPurchases = filteredGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalSales - totalPurchases;
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending').length;
  const paidGarments = filteredGarments.filter(g => g.payment_status === 'paid').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel de Administrador</h1>
            <p className="text-gray-600">Estadísticas de ventas y gestión de pagos</p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ventas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</div>
                <p className="text-xs text-gray-500">{filteredGarments.length} prendas vendidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ganancia Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatPrice(totalProfit)}</div>
                <p className="text-xs text-gray-500">Venta - Compra</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pagos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
                <p className="text-xs text-gray-500">Prendas por pagar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pagos Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{paidGarments}</div>
                <p className="text-xs text-gray-500">Prendas pagadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de prendas vendidas */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Prendas Vendidas</CardTitle>
                  <p className="text-gray-600 mt-1">
                    {filteredGarments.length} prendas encontradas
                  </p>
                </div>
                <MonthFilter
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
            </CardHeader>
            <CardContent>
              <GarmentsTable
                garments={filteredGarments}
                onMarkAsPaid={handlePaymentClick}
                onDelete={handleDeleteClick}
                suppliers={suppliers}
                showSupplierColumn={true}
                adminMode={true}
                hideActions={['markAsSold']}
              />
            </CardContent>
          </Card>
        </div>
      </main>

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

export default AdminDashboard;
