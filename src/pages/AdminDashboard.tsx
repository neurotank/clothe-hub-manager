
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Plus,
  Search
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GarmentsTable from '../components/GarmentsTable';
import EditGarmentModal from '../components/EditGarmentModal';
import SellConfirmDialog from '../components/SellConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import MonthFilter from '../components/MonthFilter';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Garment } from '../types';

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const { suppliers, garments, loading, updateGarment, deleteGarment, editGarment } = useSupabaseData();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');

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
        description: `Se registró el pago de ${paymentDialog.garmentName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el pago",
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

  const handleMonthFilterChange = (month: string) => {
    setMonthFilter(month);
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

  const filteredGarments = garments.filter(garment => {
    const matchesSearch = 
      garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'available' && !garment.is_sold) ||
      (statusFilter === 'sold' && garment.is_sold) ||
      (statusFilter === 'pending_payment' && garment.payment_status === 'pending') ||
      (statusFilter === 'paid' && garment.payment_status === 'paid');

    const matchesMonth = 
      monthFilter === 'all' || 
      new Date(garment.created_at).toISOString().substring(0, 7) === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const totalGarments = filteredGarments.length;
  const totalPages = Math.ceil(totalGarments / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGarments = filteredGarments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-blue-50 text-blue-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-blue-700 text-sm">+12% este mes</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 text-green-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prendas en Stock</CardTitle>
              <Package className="h-4 w-4 text-green-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{garments.filter(g => !g.is_sold).length}</div>
              <p className="text-green-700 text-sm">+8% este mes</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 text-yellow-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-yellow-700 text-sm">+19% este mes</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 text-red-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">201</div>
              <p className="text-red-700 text-sm">+3% este mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Administrar Prendas
            {totalGarments !== garments.length && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalGarments} de {garments.length})
              </span>
            )}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <MonthFilter selectedMonth={monthFilter} onMonthChange={handleMonthFilterChange} />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Prenda
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <GarmentsTable 
            garments={paginatedGarments}
            onMarkAsSold={handleSellClick}
            onMarkAsPaid={handlePaymentClick}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            suppliers={suppliers}
            showSupplierColumn={true}
            adminMode={true}
          />
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <Footer />

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

export default AdminDashboard;
