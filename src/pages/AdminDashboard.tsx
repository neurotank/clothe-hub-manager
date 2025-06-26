
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, DollarSign, TrendingUp, Users, Percent, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Calcular estadísticas
  const totalRevenue = filteredGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalCost = filteredGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const averageTicket = filteredGarments.length > 0 ? totalRevenue / filteredGarments.length : 0;

  // Datos para el gráfico de los últimos 6 meses
  const getLastSixMonthsData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      
      const monthGarments = allSoldGarments.filter(garment => {
        const soldDate = garment.sold_at ? new Date(garment.sold_at) : new Date(garment.created_at);
        return soldDate.toISOString().slice(0, 7) === monthKey;
      });
      
      const revenue = monthGarments.reduce((sum, g) => sum + g.sale_price, 0);
      const cost = monthGarments.reduce((sum, g) => sum + g.purchase_price, 0);
      
      months.push({
        month: monthName,
        ingresos: revenue,
        ganancia: revenue - cost,
        prendas: monthGarments.length
      });
    }
    
    return months;
  };

  const chartData = getLastSixMonthsData();

  // Paginación
  const totalPages = Math.ceil(filteredGarments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGarments = filteredGarments.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">
              Resumen de ventas y métricas de negocio
            </p>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
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
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Margen</p>
                <p className="text-xl font-bold text-gray-900">{profitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ticket Prom.</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(averageTicket)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prendas</p>
                <p className="text-xl font-bold text-gray-900">{filteredGarments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proveedores</p>
                <p className="text-xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Evolución últimos 6 meses</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(Number(value)), 
                    name === 'ingresos' ? 'Ingresos' : name === 'ganancia' ? 'Ganancia' : 'Prendas'
                  ]}
                />
                <Bar dataKey="ingresos" fill="#3b82f6" name="ingresos" />
                <Bar dataKey="ganancia" fill="#10b981" name="ganancia" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border">
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
            
            <div className="overflow-hidden">
              <GarmentsTable
                garments={currentGarments}
                onMarkAsPaid={markAsPaid}
                onDelete={deleteGarment}
                suppliers={suppliers}
                showSupplierColumn={true}
                adminMode={true}
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
    </div>
  );
};

export default AdminDashboard;
