
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'available' | 'sold' | 'pending_payment' | 'paid';
  onStatusFilterChange: (filter: 'all' | 'available' | 'sold' | 'pending_payment' | 'paid') => void;
  showSupplierFilter?: boolean;
  supplierFilter?: string;
  onSupplierFilterChange?: (value: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  showSupplierFilter = false,
  supplierFilter = '',
  onSupplierFilterChange
}) => {
  const statusFilters = [
    { key: 'all', label: 'Todos', count: 0 },
    { key: 'available', label: 'Disponibles', count: 0 },
    { key: 'sold', label: 'Vendidas', count: 0 },
    { key: 'pending_payment', label: 'Pago Pendiente', count: 0 },
    { key: 'paid', label: 'Pagadas', count: 0 },
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por código, nombre de prenda..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showSupplierFilter && onSupplierFilterChange && (
          <div className="relative sm:w-64">
            <Input
              placeholder="Filtrar por proveedor..."
              value={supplierFilter}
              onChange={(e) => onSupplierFilterChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={statusFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange(filter.key as any)}
            className="text-xs"
          >
            <Filter className="w-3 h-3 mr-1" />
            {filter.label}
          </Button>
        ))}
        
        {(searchTerm || statusFilter !== 'all' || supplierFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
              if (onSupplierFilterChange) onSupplierFilterChange('');
            }}
            className="text-xs text-gray-500"
          >
            <X className="w-3 h-3 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
