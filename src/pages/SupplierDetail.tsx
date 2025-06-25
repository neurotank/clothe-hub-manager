import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Header from '../components/Header';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import SellConfirmDialog from '../components/SellConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useIsMobile } from '../hooks/use-mobile';

const ITEMS_PER_PAGE = 20;

const SupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    suppliers,
    getGarmentsBySupplier,
    markAsSold,
    markAsPaid,
    deleteGarment,
    loading
  } = useSupabaseData();
  
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const filteredGarments = allGarments.filter(garment => {
    // Combined search: name, size, and code
    const matchesSearch = searchTerm === '' || 
      garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'available') {
      matchesStatus = !garment.is_sold;
    } else if (statusFilter === 'sold') {
      matchesStatus = garment.is_sold;
    } else if (statusFilter === 'pending_payment') {
      matchesStatus = garment.is_sold && garment.payment_status === 'pending';
    } else if (statusFilter === 'paid') {
      matchesStatus = garment.payment_status === 'paid';
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredGarments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGarments = filteredGarments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
                <Button
                  onClick={() => setIsAddGarmentOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Prenda
                </Button>
              </div>
            </div>

            <div className="p-6">
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchPlaceholder="Buscar por nombre, talle o código..."
              />
              
              <GarmentsTable
                garments={paginatedGarments}
                onMarkAsSold={handleSellClick}
                onMarkAsPaid={handlePaymentClick}
                onDelete={handleDeleteClick}
                supplier={supplier}
              />

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
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
