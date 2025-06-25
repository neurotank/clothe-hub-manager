
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: 'all' | 'available' | 'sold' | 'pending_payment' | 'paid';
  onStatusFilterChange?: (filter: 'all' | 'available' | 'sold' | 'pending_payment' | 'paid') => void;
  phoneFilter?: string;
  onPhoneFilterChange?: (value: string) => void;
  showSupplierFilter?: boolean;
  supplierFilter?: string;
  onSupplierFilterChange?: (value: string) => void;
  sizeFilter?: string;
  onSizeFilterChange?: (value: string) => void;
  codeFilter?: string;
  onCodeFilterChange?: (value: string) => void;
  searchPlaceholder?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  phoneFilter,
  onPhoneFilterChange,
  showSupplierFilter = false,
  supplierFilter = '',
  onSupplierFilterChange,
  sizeFilter = '',
  onSizeFilterChange,
  codeFilter = '',
  onCodeFilterChange,
  searchPlaceholder = "Buscar...",
  showBackButton = false,
  onBack
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const statusFilters = [
    { key: 'all', label: 'Todos' },
    { key: 'available', label: 'Disponibles' },
    { key: 'sold', label: 'Vendidas' },
    { key: 'pending_payment', label: 'Pago Pendiente' },
    { key: 'paid', label: 'Pagadas' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const hasActiveFilters = searchTerm || 
    (statusFilter && statusFilter !== 'all') || 
    supplierFilter || 
    phoneFilter || 
    sizeFilter || 
    codeFilter;

  const clearAllFilters = () => {
    onSearchChange('');
    if (onStatusFilterChange) onStatusFilterChange('all');
    if (onSupplierFilterChange) onSupplierFilterChange('');
    if (onPhoneFilterChange) onPhoneFilterChange('');
    if (onSizeFilterChange) onSizeFilterChange('');
    if (onCodeFilterChange) onCodeFilterChange('');
  };

  return (
    <div className="space-y-4 mb-6">
      {isMobile && showBackButton && (
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {phoneFilter !== undefined && onPhoneFilterChange && (
            <Input
              placeholder="Filtrar por teléfono..."
              value={phoneFilter}
              onChange={(e) => onPhoneFilterChange(e.target.value)}
              className="sm:w-48"
            />
          )}
          
          {showSupplierFilter && onSupplierFilterChange && (
            <Input
              placeholder="Filtrar por proveedor..."
              value={supplierFilter}
              onChange={(e) => onSupplierFilterChange(e.target.value)}
              className="sm:w-48"
            />
          )}

          {sizeFilter !== undefined && onSizeFilterChange && (
            <Input
              placeholder="Filtrar por talle..."
              value={sizeFilter}
              onChange={(e) => onSizeFilterChange(e.target.value)}
              className="sm:w-32"
            />
          )}

          {codeFilter !== undefined && onCodeFilterChange && (
            <Input
              placeholder="Filtrar por código..."
              value={codeFilter}
              onChange={(e) => onCodeFilterChange(e.target.value)}
              className="sm:w-40"
            />
          )}
        </div>
      </div>

      {statusFilter && onStatusFilterChange && (
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
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-500"
            >
              <X className="w-3 h-3 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
