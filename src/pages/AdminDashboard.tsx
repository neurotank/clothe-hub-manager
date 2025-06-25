
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MonthFilter from '../components/MonthFilter';
import SearchAndFilters from '../components/SearchAndFilters';
import GarmentsTable from '../components/GarmentsTable';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useIsMobile } from '../hooks/use-mobile';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    suppliers,
    garments,
    deleteGarment,
    markAsPaid,
    loading
  } = useSupabaseData();
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_payment' | 'paid'>('all');
  
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

  // Only show sold garments in admin dashboard
  const soldGarments = garments.filter(g => g.is_sold);

  const filteredGarments = soldGarments.filter(garment => {
    // Combined search: name, size, code, and supplier
    const supplier = suppliers.find(s => s.id === garment.supplier_id);
    const supplierName = supplier ? `${supplier.name} ${supplier.surname}` : '';
    
    const matchesSearch = searchTerm === '' || 
      garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'pending_payment') {
      matchesStatus = garment.payment_status === 'pending';
    } else if (statusFilter === 'paid') {
      matchesStatus = garment.payment_status === 'paid';
    }

    let matchesMonth = true;
    if (selectedMonth) {
      const garmentMonth = new Date(garment.created_at).toISOString().slice(0, 7);
      matchesMonth = garmentMonth === selectedMonth;
    }
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const availableGarments = garments.filter(g => !g.is_sold);
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending');

  const totalRevenue = filteredGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalCost = filteredGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalRevenue - totalCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
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

  // Handler that properly handles the status filter change
  const handleStatusFilterChange = (filter: 'all' | 'available' | 'sold' | 'pending_payment' | 'paid') => {
    // Only accept valid admin filters for sold garments
    if (filter === 'all' || filter === 'pending_payment' || filter === 'paid') {
      setStatusFilter(filter);
    }
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
          {isMobile && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          )}
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Resumen general del negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prendas</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredGarments.length}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {availableGarments.length} disponibles
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    {soldGarments.length} vendidas
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredGarments.length} prendas vendidas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancia</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(totalProfit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Margen: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {pendingPayments.length > 0 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Pagos Pendientes</CardTitle>
                <CardDescription className="text-yellow-700">
                  Hay {pendingPayments.length} prendas vendidas con pago pendiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-800">
                  {formatPrice(pendingPayments.reduce((sum, g) => sum + g.sale_price, 0))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-6 py-4">
            <MonthFilter
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Prendas Vendidas</CardTitle>
              <CardDescription>
                Gestión de prendas vendidas y pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                searchPlaceholder="Buscar por prenda, talle, código o proveedor..."
              />
              
              <GarmentsTable
                garments={filteredGarments}
                onDelete={handleDeleteClick}
                onMarkAsPaid={handlePaymentClick}
                hideActions={['markAsSold']}
                suppliers={suppliers}
                showSupplierColumn={true}
                adminMode={true}
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
