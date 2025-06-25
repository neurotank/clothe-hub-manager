
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, DollarSign, Eye } from 'lucide-react';
import { Garment, Supplier } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

interface GarmentsTableProps {
  garments: Garment[];
  onMarkAsSold?: (garmentId: string, garmentName: string) => void;
  onMarkAsPaid?: (garmentId: string, garmentName: string) => void;
  onDelete: (garmentId: string, garmentName: string) => void;
  hideActions?: Array<'markAsSold' | 'markAsPaid'>;
  suppliers?: Supplier[];
  showSupplierColumn?: boolean;
  adminMode?: boolean;
  supplier?: Supplier;
}

const GarmentsTable: React.FC<GarmentsTableProps> = ({
  garments,
  onMarkAsSold,
  onMarkAsPaid,
  onDelete,
  hideActions = [],
  suppliers = [],
  showSupplierColumn = false,
  adminMode = false,
  supplier
}) => {
  const isMobile = useIsMobile();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'not_available':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">No disponible</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pagado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getSupplierName = (supplierId: string) => {
    const foundSupplier = suppliers.find(s => s.id === supplierId);
    return foundSupplier ? `${foundSupplier.name} ${foundSupplier.surname}` : 'N/A';
  };

  if (garments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          No hay prendas registradas
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Talle</TableHead>
            <TableHead>Precio Compra</TableHead>
            <TableHead>Precio Venta</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="hidden md:table-cell">Vendido</TableHead>
            {showSupplierColumn && <TableHead className="hidden md:table-cell">Proveedor</TableHead>}
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Pago</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {garments.map((garment) => (
            <TableRow 
              key={garment.id} 
              className={`hover:bg-gray-50 ${garment.is_sold ? 'opacity-60' : ''}`}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{garment.code}</div>
                  <div className="sm:hidden text-xs text-gray-500 mt-1">
                    Talle: {garment.size}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{garment.name}</div>
                  <div className="sm:hidden text-xs text-gray-500 mt-1">
                    <div className="text-gray-400 text-xs">
                      Creado: {formatDate(garment.created_at)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{garment.size}</TableCell>
              <TableCell>
                <span className="font-semibold text-blue-600">
                  {formatPrice(garment.purchase_price)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-green-600">
                  {formatPrice(garment.sale_price)}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(garment.created_at)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {garment.sold_at ? formatDate(garment.sold_at) : '-'}
              </TableCell>
              {showSupplierColumn && (
                <TableCell className="hidden md:table-cell">
                  {garment.supplier_id ? getSupplierName(garment.supplier_id) : 'N/A'}
                </TableCell>
              )}
              <TableCell className="text-center">
                <Badge 
                  variant={garment.is_sold ? "secondary" : "default"}
                  className={garment.is_sold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}
                >
                  {garment.is_sold ? 'Vendida' : 'Disponible'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {getPaymentBadge(garment.payment_status)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                  {!garment.is_sold && !hideActions.includes('markAsSold') && onMarkAsSold && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsSold(garment.id, garment.name)}
                      className="text-green-600 border-green-600 hover:bg-green-50 text-xs px-2 py-1 h-auto min-h-[32px]"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 hidden sm:inline">
                        {isMobile ? 'Vendido' : 'Vender'}
                      </span>
                    </Button>
                  )}
                  {garment.is_sold && garment.payment_status === 'pending' && !hideActions.includes('markAsPaid') && onMarkAsPaid && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsPaid(garment.id, garment.name)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-auto min-h-[32px]"
                    >
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 hidden sm:inline">
                        {isMobile ? 'Pagado' : 'Pagar'}
                      </span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(garment.id, garment.name)}
                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs px-2 py-1 h-auto min-h-[32px]"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="ml-1 hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GarmentsTable;
