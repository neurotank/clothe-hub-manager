
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
import { Check, X, DollarSign } from 'lucide-react';
import { Garment } from '../types';

interface GarmentsTableProps {
  garments: Garment[];
  onMarkAsSold: (garmentId: number, garmentName: string) => void;
  onMarkAsPaid: (garmentId: number, garmentName: string) => void;
  onDelete: (garmentId: number, garmentName: string) => void;
}

const GarmentsTable: React.FC<GarmentsTableProps> = ({
  garments,
  onMarkAsSold,
  onMarkAsPaid,
  onDelete
}) => {
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

  if (garments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          No hay prendas registradas para este proveedor
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
            <TableHead className="hidden lg:table-cell">Precio Compra</TableHead>
            <TableHead className="hidden lg:table-cell">Precio Venta</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="hidden md:table-cell">Vendido</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Pago</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {garments.map((garment) => (
            <TableRow 
              key={garment.id} 
              className={`hover:bg-gray-50 ${garment.isSold ? 'opacity-60' : ''}`}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{garment.code}</div>
                  <div className="sm:hidden text-xs text-gray-500">
                    {garment.size} • {formatPrice(garment.salePrice)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{garment.name}</div>
                  <div className="sm:hidden text-xs text-gray-500">
                    Creado: {formatDate(garment.createdAt)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{garment.size}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatPrice(garment.purchasePrice)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatPrice(garment.salePrice)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(garment.createdAt)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {garment.soldAt ? formatDate(garment.soldAt) : '-'}
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={garment.isSold ? "secondary" : "default"}
                  className={garment.isSold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}
                >
                  {garment.isSold ? 'Vendida' : 'Disponible'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {getPaymentBadge(garment.paymentStatus)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                  {!garment.isSold && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsSold(garment.id, garment.name)}
                      className="text-green-600 border-green-600 hover:bg-green-50 text-xs"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1">Vender</span>
                    </Button>
                  )}
                  {garment.isSold && garment.paymentStatus === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsPaid(garment.id, garment.name)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs"
                    >
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1">Pagar</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(garment.id, garment.name)}
                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="ml-1">Eliminar</span>
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
