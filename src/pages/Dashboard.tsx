
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import SearchAndFilters from '../components/SearchAndFilters';
import AddSupplierModal from '../components/AddSupplierModal';
import { useDataStore } from '../hooks/useDataStore';
import { SupplierFormData } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { suppliers, getGarmentsBySupplier, addSupplier } = useDataStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  // Filtrar proveedores basado en búsqueda
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(supplierFilter.toLowerCase())
    );
  }, [suppliers, supplierFilter]);

  const handleViewDetail = (supplierId: number) => {
    navigate(`/supplier/${supplierId}`);
  };

  const handleAddSupplier = (supplierData: SupplierFormData) => {
    const newSupplier = addSupplier(supplierData);
    toast({
      title: "Proveedor agregado",
      description: `${newSupplier.name} ha sido agregado exitosamente.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Gestiona tus proveedores y sus prendas en consignación</p>
          </div>
          <Button 
            onClick={() => setShowAddSupplierModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proveedor
          </Button>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showSupplierFilter={true}
          supplierFilter={supplierFilter}
          onSupplierFilterChange={setSupplierFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Prendas Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {suppliers.reduce((acc, supplier) => {
                  const garments = getGarmentsBySupplier(supplier.id);
                  return acc + garments.filter(g => !g.isSold).length;
                }, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Prendas Vendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {suppliers.reduce((acc, supplier) => {
                  const garments = getGarmentsBySupplier(supplier.id);
                  return acc + garments.filter(g => g.isSold).length;
                }, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pagos Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {suppliers.reduce((acc, supplier) => {
                  const garments = getGarmentsBySupplier(supplier.id);
                  return acc + garments.filter(g => g.paymentStatus === 'pending').length;
                }, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Proveedores
              {filteredSuppliers.length !== suppliers.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredSuppliers.length} de {suppliers.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                    <TableHead className="hidden lg:table-cell">Dirección</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-center">Prendas</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => {
                    const garments = getGarmentsBySupplier(supplier.id);
                    const availableGarments = garments.filter(g => !g.isSold).length;
                    const soldGarments = garments.filter(g => g.isSold).length;
                    const pendingPayments = garments.filter(g => g.paymentStatus === 'pending').length;
                    
                    return (
                      <TableRow key={supplier.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="sm:hidden text-xs text-gray-500">
                              {supplier.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">
                          {supplier.phone}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-600">
                          {supplier.address}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-600">
                          {supplier.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-sm font-medium text-green-600">
                              {availableGarments} disponibles
                            </span>
                            <div className="flex space-x-2 text-xs">
                              <span className="text-gray-500">
                                {soldGarments} vendidas
                              </span>
                              {pendingPayments > 0 && (
                                <span className="text-yellow-600 font-medium">
                                  {pendingPayments} pendientes
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetail(supplier.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ver detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddSupplierModal
          open={showAddSupplierModal}
          onOpenChange={setShowAddSupplierModal}
          onSupplierAdd={handleAddSupplier}
        />
      </main>
    </div>
  );
};

export default Dashboard;
