
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Header from '../components/Header';
import AddSupplierModal from '../components/AddSupplierModal';
import SearchAndFilters from '../components/SearchAndFilters';
import SuppliersTable from '../components/SuppliersTable';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;

const Dashboard = () => {
  const { suppliers, loading } = useSupabaseData();
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.surname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSupplierClick = (supplierId: string) => {
    navigate(`/supplier/${supplierId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
              <p className="text-gray-600 mt-1">Gestiona tus proveedores y sus prendas</p>
            </div>
            <Button
              onClick={() => setIsAddSupplierOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Proveedor
            </Button>
          </div>

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por nombre o apellido..."
          />

          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {suppliers.length === 0 
                  ? 'No hay proveedores registrados'
                  : 'No se encontraron proveedores con los filtros aplicados'
                }
              </p>
              {suppliers.length === 0 && (
                <Button
                  onClick={() => setIsAddSupplierOpen(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar tu primer proveedor
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <SuppliersTable 
                suppliers={paginatedSuppliers}
                onSupplierClick={handleSupplierClick}
              />
              
              {totalPages > 1 && (
                <div className="flex justify-center">
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
          )}
        </div>
      </main>

      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
