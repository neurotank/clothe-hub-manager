
import React, { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Supplier, SupplierFormData, Garment } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  // Cargar suppliers
  const loadSuppliers = async () => {
    try {
      console.log('Loading suppliers...');
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading suppliers:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los proveedores",
          variant: "destructive",
        });
      } else {
        console.log('Suppliers loaded:', data);
        setSuppliers(data || []);
      }
    } catch (error) {
      console.error('Error en loadSuppliers:', error);
    }
  };

  // Cargar prendas
  const loadGarments = async () => {
    try {
      console.log('Loading garments...');
      const { data, error } = await supabase
        .from('garments')
        .select('*');

      if (error) {
        console.error('Error loading garments:', error);
      } else {
        console.log('Garments loaded:', data);
        setGarments(data || []);
      }
    } catch (error) {
      console.error('Error en loadGarments:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading data...');
      Promise.all([loadSuppliers(), loadGarments()]);
    }
  }, [user]);

  // Filtrar proveedores basado en búsqueda
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => 
      `${supplier.name} ${supplier.surname}`.toLowerCase().includes(supplierFilter.toLowerCase())
    );
  }, [suppliers, supplierFilter]);

  const handleViewDetail = (supplierId: string) => {
    navigate(`/supplier/${supplierId}`);
  };

  const handleAddSupplier = async (supplierData: SupplierFormData) => {
    try {
      console.log('Adding supplier:', supplierData);
      
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: supplierData.name,
          surname: supplierData.surname,
          phone: supplierData.phone,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding supplier:', error);
        toast({
          title: "Error",
          description: "No se pudo agregar el proveedor",
          variant: "destructive",
        });
      } else {
        console.log('Supplier added successfully:', data);
        setSuppliers(prev => [...prev, data]);
        setShowAddSupplierModal(false);
        toast({
          title: "Proveedor agregado",
          description: `${data.name} ${data.surname} ha sido agregado exitosamente.`,
        });
      }
    } catch (error) {
      console.error('Error en handleAddSupplier:', error);
      toast({
        title: "Error",
        description: "Error inesperado al agregar el proveedor",
        variant: "destructive",
      });
    }
  };

  const getGarmentsBySupplier = (supplierId: string) => {
    return garments.filter(g => g.supplier_id === supplierId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

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
                {garments.filter(g => !g.is_sold).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Prendas Vendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {garments.filter(g => g.is_sold).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pagos Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {garments.filter(g => g.payment_status === 'pending').length}
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
                    <TableHead className="text-center">Prendas</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => {
                    const supplierGarments = getGarmentsBySupplier(supplier.id);
                    const availableGarments = supplierGarments.filter(g => !g.is_sold).length;
                    const soldGarments = supplierGarments.filter(g => g.is_sold).length;
                    const pendingPayments = supplierGarments.filter(g => g.payment_status === 'pending').length;
                    
                    return (
                      <TableRow key={supplier.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{supplier.name} {supplier.surname}</div>
                            <div className="sm:hidden text-xs text-gray-500">
                              {supplier.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">
                          {supplier.phone}
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
