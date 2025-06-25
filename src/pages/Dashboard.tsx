
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import Header from '../components/Header';
import AddSupplierModal from '../components/AddSupplierModal';
import SearchAndFilters from '../components/SearchAndFilters';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { suppliers, loading } = useSupabaseData();
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const navigate = useNavigate();

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.surname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhone = supplier.phone.includes(phoneFilter);
    return matchesSearch && matchesPhone;
  });

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
            phoneFilter={phoneFilter}
            onPhoneFilterChange={setPhoneFilter}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/supplier/${supplier.id}`)}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {supplier.name} {supplier.surname}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      📱 {supplier.phone}
                    </p>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Registrado: {new Date(supplier.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
