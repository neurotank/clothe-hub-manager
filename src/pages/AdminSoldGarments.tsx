
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GarmentsTable from '../components/GarmentsTable';
import MonthFilter from '../components/MonthFilter';
import { useSupabaseData } from '../hooks/useSupabaseData';

const AdminSoldGarments = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">Prendas Vendidas</h1>
              <p className="text-gray-600 mt-1">
                Gestiona los pagos de las prendas vendidas
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Todas las Prendas Vendidas
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

export default AdminSoldGarments;
