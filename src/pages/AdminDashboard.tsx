
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GarmentsTable from '../components/GarmentsTable';
import MonthFilter from '../components/MonthFilter';
import SearchAndFilters from '../components/SearchAndFilters';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useIsMobile } from '../hooks/use-mobile';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    suppliers,
    getAllSoldGarments,
    markAsPaid,
    deleteGarment,
    loading
  } = useSupabaseData();
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');

  const allSoldGarments = getAllSoldGarments();

  const filteredGarments = allSoldGarments.filter(garment => {
    const soldDate = garment.sold_at ? new Date(garment.sold_at) : new Date(garment.created_at);
    const matchesMonth = selectedMonth ? (() => {
      const [year, month] = selectedMonth.split('-');
      return soldDate.getFullYear() === parseInt(year) && 
             soldDate.getMonth() === parseInt(month) - 1;
    })() : true;

    const matchesSearch = 
      garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending_payment' && garment.payment_status === 'pending') ||
      (statusFilter === 'paid' && garment.payment_status === 'paid');

    return matchesMonth && matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalCost = filteredGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalRevenue - totalCost;
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">
              Resumen de ventas y métricas de negocio
            </p>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ganancia</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prendas Vendidas</p>
                <p className="text-2xl font-bold text-gray-900">{filteredGarments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proveedores</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Prendas Vendidas
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredGarments.length} prendas encontradas
                </p>
              </div>
              <MonthFilter
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </div>
          </div>
          
          <div className="p-6">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchPlaceholder="Buscar por código o nombre..."
            />
            
            <GarmentsTable
              garments={filteredGarments.slice(0, 10)}
              onMarkAsPaid={markAsPaid}
              onDelete={deleteGarment}
              suppliers={suppliers}
              showSupplierColumn={true}
              adminMode={true}
            />
          </div>
          
          {filteredGarments.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <Button
                onClick={() => navigate('/admin/sold-garments')}
                variant="outline"
              >
                Ver todas las prendas vendidas
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
