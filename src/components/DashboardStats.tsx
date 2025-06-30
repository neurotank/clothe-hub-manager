
import React from 'react';
import { Users, Package } from 'lucide-react';

interface DashboardStatsProps {
  suppliersCount: number;
  garmentsCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  suppliersCount, 
  garmentsCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Proveedores</p>
            <p className="text-2xl font-bold text-gray-900">{suppliersCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Prendas</p>
            <p className="text-2xl font-bold text-gray-900">{garmentsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
