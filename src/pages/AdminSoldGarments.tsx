
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
            onClick={() => navigate('/admin')}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Prendas Vendidas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los pagos de las prendas vendidas
            </p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSoldGarments;
