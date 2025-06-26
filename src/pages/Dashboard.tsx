
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SuppliersTable from '../components/SuppliersTable';
import AddSupplierModal from '../components/AddSupplierModal';
import DeleteSupplierDialog from '../components/DeleteSupplierDialog';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Supplier } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    suppliers,
    garments,
    addSupplier,
    deleteSupplier,
    loading
  } = useSupabaseData();

  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeleteSupplier = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplier) {
      await deleteSupplier(selectedSupplier.id);
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    `${supplier.name} ${supplier.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  // Paginación
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

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

          {/* Estadísticas generales - solo proveedores y total prendas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Proveedores</p>
                  <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Prendas</p>
                  <p className="text-2xl font-bold text-gray-900">{garments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de proveedores */}
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Proveedores</h2>
                <p className="text-gray-600 mt-1">
                  {filteredSuppliers.length} proveedores registrados
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <SuppliersTable
              suppliers={currentSuppliers}
              onSupplierClick={(supplierId) => navigate(`/supplier/${supplierId}`)}
              onDeleteSupplier={handleDeleteSupplier}
            />
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-200">
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
      </main>

      <Footer />

      <AddSupplierModal
        isOpen={showAddSupplier}
        onClose={() => setShowAddSupplier(false)}
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
