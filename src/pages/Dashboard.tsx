
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardStats from '../components/DashboardStats';
import SuppliersSection from '../components/SuppliersSection';
import AddSupplierModal from '../components/AddSupplierModal';
import EditSupplierModal from '../components/EditSupplierModal';
import DeleteSupplierDialog from '../components/DeleteSupplierDialog';
import { useDashboardLogic } from '../hooks/useDashboardLogic';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    // Data
    suppliers,
    garments,
    loading,
    currentSuppliers,
    filteredSuppliers,
    
    // Modal states
    showAddSupplier,
    showEditSupplier,
    showDeleteDialog,
    selectedSupplier,
    
    // Search and pagination
    searchTerm,
    currentPage,
    totalPages,
    
    // Handlers
    setShowAddSupplier,
    setSearchTerm,
    setCurrentPage,
    handleAddSupplier,
    handleEditSupplier,
    handleSaveEditSupplier,
    handleDeleteSupplier,
    handleConfirmDelete
  } = useDashboardLogic();

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus proveedores y supervisa el rendimiento de tu negocio
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setShowAddSupplier(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Proveedor
              </Button>
            </div>
          </div>

          <DashboardStats 
            suppliersCount={suppliers.length}
            garmentsCount={garments.length}
          />
        </div>

        <SuppliersSection
          suppliers={currentSuppliers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSupplierClick={(supplierId) => navigate(`/supplier/${supplierId}`)}
          onDeleteSupplier={handleDeleteSupplier}
          onEditSupplier={handleEditSupplier}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />

      <AddSupplierModal
        isOpen={showAddSupplier}
        onClose={() => setShowAddSupplier(false)}
        onAddSupplier={handleAddSupplier}
      />

      <EditSupplierModal
        isOpen={showEditSupplier}
        onClose={() => setShowEditSupplier(false)}
        supplier={selectedSupplier}
        onSave={handleSaveEditSupplier}
      />

      <DeleteSupplierDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setSelectedSupplier(null);
        }}
        onConfirm={handleConfirmDelete}
        supplierName={selectedSupplier ? `${selectedSupplier.name} ${selectedSupplier.surname}` : ''}
      />
    </div>
  );
};

export default Dashboard;
