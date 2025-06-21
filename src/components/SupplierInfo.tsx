
import React from 'react';
import { Supplier } from '../types';

interface SupplierInfoProps {
  supplier: Supplier;
}

const SupplierInfo: React.FC<SupplierInfoProps> = ({ supplier }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{supplier.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-500">Teléfono:</span>
          <p className="text-gray-900">{supplier.phone}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500">Email:</span>
          <p className="text-gray-900">{supplier.email}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500">Dirección:</span>
          <p className="text-gray-900">{supplier.address}</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierInfo;
