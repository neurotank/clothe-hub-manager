
import React from 'react';
import { Button } from '@/components/ui/button';
import SuppliersTable from './SuppliersTable';
import { Supplier } from '../types';

interface SuppliersSectionProps {
  suppliers: Supplier[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSupplierClick: (supplierId: string) => void;
  onDeleteSupplier: (supplierId: string) => void;
  onEditSupplier: (supplier: Supplier) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SuppliersSection: React.FC<SuppliersSectionProps> = ({
  suppliers,
  searchTerm,
  onSearchChange,
  onSupplierClick,
  onDeleteSupplier,
  onEditSupplier,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proveedores</h2>
            <p className="text-gray-600 mt-1">
              {suppliers.length} proveedores registrados
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <SuppliersTable
          suppliers={suppliers}
          onSupplierClick={onSupplierClick}
          onDeleteSupplier={onDeleteSupplier}
          onEditSupplier={onEditSupplier}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuppliersSection;
