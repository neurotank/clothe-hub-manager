
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import SearchAndFilters from '../components/SearchAndFilters';
import MonthFilter from '../components/MonthFilter';
import { useDataStore } from '../hooks/useDataStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminSoldGarments: React.FC = () => {
  const { suppliers, getAllSoldGarments } = useDataStore();
  const soldGarments = getAllSoldGarments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Filtrar prendas vendidas
  const filteredGarments = useMemo(() => {
    return soldGarments.filter(garment => {
      const supplier = suppliers.find(s => s.id === garment.supplier_id);
      const supplierName = supplier?.name || '';
      
      const matchesSearch = 
        garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSupplier = supplierFilter === '' || 
        supplierName.toLowerCase().includes(supplierFilter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending_payment' && garment.payment_status === 'pending') ||
        (statusFilter === 'paid' && garment.payment_status === 'paid');
      
      // Filtro por mes
      const matchesMonth = selectedMonth === 'all' || 
        (garment.sold_at && format(new Date(garment.sold_at), 'yyyy-MM') === selectedMonth);
      
      return matchesSearch && matchesSupplier && matchesStatus && matchesMonth;
    });
  }, [soldGarments, suppliers, searchTerm, supplierFilter, statusFilter, selectedMonth]);

  const totalRevenue = filteredGarments.reduce((acc, garment) => acc + garment.sale_price, 0);
  const totalProfit = filteredGarments.reduce((acc, garment) => acc + (garment.sale_price - garment.purchase_price), 0);
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Administración - Prendas Vendidas</h2>
          <p className="text-gray-600">Vista completa de todas las prendas vendidas y sus pagos</p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            showSupplierFilter={true}
            supplierFilter={supplierFilter}
            onSupplierFilterChange={setSupplierFilter}
          />
          
          <MonthFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Vendidas
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredGarments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos Totales
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">€{totalRevenue}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ganancia Total
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">€{totalProfit}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pagos Pendientes
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Prendas Vendidas
              {filteredGarments.length !== soldGarments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {soldGarments.length})
                </span>
              )}
              {selectedMonth !== 'all' && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  - {selectedMonth}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Prenda</TableHead>
                    <TableHead className="hidden lg:table-cell">Proveedor</TableHead>
                    <TableHead>Talla</TableHead>
                    <TableHead className="hidden sm:table-cell">Precio Compra</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead className="hidden md:table-cell">Ganancia</TableHead>
                    <TableHead className="hidden lg:table-cell">Fecha Venta</TableHead>
                    <TableHead className="text-center">Estado Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGarments.map((garment) => {
                    const supplier = suppliers.find(s => s.id === garment.supplier_id);
                    const profit = garment.sale_price - garment.purchase_price;
                    
                    return (
                      <TableRow key={garment.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{garment.code}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{garment.name}</div>
                            <div className="lg:hidden text-xs text-gray-500">
                              {supplier?.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier?.name}
                        </TableCell>
                        <TableCell>{garment.size}</TableCell>
                        <TableCell className="hidden sm:table-cell">€{garment.purchase_price}</TableCell>
                        <TableCell className="font-medium">€{garment.sale_price}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
                            €{profit}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {garment.sold_at && format(new Date(garment.sold_at), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={garment.payment_status === 'paid' ? 'default' : 'secondary'}
                            className={
                              garment.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {garment.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSoldGarments;
