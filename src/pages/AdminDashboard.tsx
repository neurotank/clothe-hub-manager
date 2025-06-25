
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GarmentsTable from '../components/GarmentsTable';
import MonthFilter from '../components/MonthFilter';
import { useSupabaseData } from '../hooks/useSupabaseData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    suppliers,
    getAllSoldGarments,
    markAsPaid,
    deleteGarment,
    loading
  } = useSupabaseData();
  
  const [selectedMonth, setSelectedMonth] = useState('');

  const allSoldGarments = getAllSoldGarments();

  const filteredGarments = selectedMonth
    ? allSoldGarments.filter(garment => {
        const soldDate = garment.sold_at ? new Date(garment.sold_at) : new Date(garment.created_at);
        const [year, month] = selectedMonth.split('-');
        return soldDate.getFullYear() === parseInt(year) && 
               soldDate.getMonth() === parseInt(month) - 1;
      })
    : allSoldGarments;

  // Calcular estadísticas
  const totalSales = filteredGarments.length;
  const totalRevenue = filteredGarments.reduce((sum, garment) => sum + garment.sale_price, 0);
  const totalCost = filteredGarments.reduce((sum, garment) => sum + garment.purchase_price, 0);
  const totalProfit = totalRevenue - totalCost;
  const paidGarments = filteredGarments.filter(g => g.payment_status === 'paid').length;
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

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
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
              <p className="text-gray-600 mt-1">
                Estadísticas de ventas y gestión de pagos
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  Prendas vendidas {selectedMonth ? 'este mes' : 'total'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Ingresos por ventas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancias</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</div>
                <p className="text-xs text-muted-foreground">
                  Ganancia neta
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total de proveedores
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estado de Pagos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-600">Pagados:</span>
                    <span className="font-semibold">{paidGarments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Pendientes:</span>
                    <span className="font-semibold">{pendingPayments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Margen de Ganancia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Margen promedio de ganancia
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Prendas Vendidas */}
          <div className="bg-white shadow-sm rounded-lg">
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
            
            <GarmentsTable
              garments={filteredGarments}
              onMarkAsPaid={markAsPaid}
              onDelete={deleteGarment}
              suppliers={suppliers}
              showSupplierColumn={true}
              adminMode={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
