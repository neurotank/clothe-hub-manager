import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, DollarSign, TrendingUp, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import SearchAndFilters from '../components/SearchAndFilters';
import AddGarmentModal from '../components/AddGarmentModal';
import SellConfirmDialog from '../components/SellConfirmDialog';
import PaymentConfirmDialog from '../components/PaymentConfirmDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import EditGarmentModal from '../components/EditGarmentModal';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useIsMobile } from '../hooks/use-mobile';
import { Garment } from '../types';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    suppliers,
    garments,
    addGarment,
    editGarment,
    markAsSold,
    markAsPaid,
    deleteGarment,
    getGarmentsBySupplier,
    loading
  } = useSupabaseData();

  const [showAddGarment, setShowAddGarment] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const supplier = suppliers.find(s => s.id === id);
  const supplierGarments = supplier ? getGarmentsBySupplier(supplier.id) : [];

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

  // Paginación
  const totalPages = Math.ceil(filteredGarments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGarments = filteredGarments.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Proveedor no encontrado</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSellGarment = (garmentId: string, garmentName: string) => {
    const garment = supplierGarments.find(g => g.id === garmentId);
    if (garment) {
      setSelectedGarment(garment);
      setShowSellDialog(true);
    }
  };

  const handleConfirmSell = async () => {
    if (selectedGarment) {
      await markAsSold(selectedGarment.id, selectedGarment.name);
      setShowSellDialog(false);
      setSelectedGarment(null);
    }
  };

  const handlePaymentGarment = (garmentId: string, garmentName: string) => {
    const garment = supplierGarments.find(g => g.id === garmentId);
    if (garment) {
      setSelectedGarment(garment);
      setShowPaymentDialog(true);
    }
  };

  const handleConfirmPayment = async () => {
    if (selectedGarment) {
      await markAsPaid(selectedGarment.id);
      setShowPaymentDialog(false);
      setSelectedGarment(null);
    }
  };

  const handleDeleteGarment = (garmentId: string, garmentName: string) => {
    const garment = supplierGarments.find(g => g.id === garmentId);
    if (garment) {
      setSelectedGarment(garment);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGarment) {
      await deleteGarment(selectedGarment.id);
      setShowDeleteDialog(false);
      setSelectedGarment(null);
    }
  };

  const handleEditGarment = (garment: Garment) => {
    setSelectedGarment(garment);
    setShowEditDialog(true);
  };

  const handleConfirmEdit = async (garmentData: any) => {
    if (selectedGarment) {
      await editGarment(selectedGarment.id, garmentData);
      setShowEditDialog(false);
      setSelectedGarment(null);
    }
  };

  const soldGarments = supplierGarments.filter(g => g.is_sold);
  const totalRevenue = soldGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalCost = soldGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalRevenue - totalCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {supplier.name} {supplier.surname}
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de prendas del proveedor
            </p>
          </div>
          <Button 
            onClick={() => setShowAddGarment(true)}
            className={`${isMobile ? 'mt-4' : ''} bg-blue-600 hover:bg-blue-700`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Prenda
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SupplierInfo supplier={supplier} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Prendas</p>
                    <p className="text-2xl font-bold text-gray-900">{supplierGarments.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ganancia</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Prendas ({filteredGarments.length})
            </h2>
          </div>
          
          <div className="p-6">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchPlaceholder="Buscar por código o nombre..."
            />
            
            <div className="overflow-hidden">
              <GarmentsTable
                garments={currentGarments}
                onMarkAsSold={handleSellGarment}
                onMarkAsPaid={handlePaymentGarment}
                onDelete={handleDeleteGarment}
                onEdit={handleEditGarment}
                supplier={supplier}
              />
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modales y diálogos */}
      <AddGarmentModal
        isOpen={showAddGarment}
        onClose={() => setShowAddGarment(false)}
        supplierId={supplier.id}
      />

      <SellConfirmDialog
        open={showSellDialog}
        onOpenChange={(open) => {
          setShowSellDialog(open);
          if (!open) setSelectedGarment(null);
        }}
        onConfirm={handleConfirmSell}
        itemName={selectedGarment?.name || ''}
      />

      <PaymentConfirmDialog
        open={showPaymentDialog}
        onOpenChange={(open) => {
          setShowPaymentDialog(open);
          if (!open) setSelectedGarment(null);
        }}
        onConfirm={handleConfirmPayment}
        itemName={selectedGarment?.name || ''}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setSelectedGarment(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedGarment?.name || ''}
      />

      <EditGarmentModal
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedGarment(null);
        }}
        onEditGarment={handleConfirmEdit}
        garment={selectedGarment}
      />
    </div>
  );
};

export default SupplierDetail;
