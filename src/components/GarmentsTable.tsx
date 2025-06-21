
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
import { Check, X } from 'lucide-react';
import { Garment } from '../types';

interface GarmentsTableProps {
  garments: Garment[];
  onMarkAsSold: (garmentId: number, garmentName: string) => void;
  onDelete: (garmentId: number, garmentName: string) => void;
}

const GarmentsTable: React.FC<GarmentsTableProps> = ({
  garments,
  onMarkAsSold,
  onDelete
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
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
            <TableHead className="hidden md:table-cell">Precio Compra</TableHead>
            <TableHead className="hidden md:table-cell">Precio Venta</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {garments.map((garment) => (
            <TableRow 
              key={garment.id} 
              className={`hover:bg-gray-50 ${garment.isSold ? 'opacity-60' : ''}`}
            >
              <TableCell className="font-medium">{garment.code}</TableCell>
              <TableCell>{garment.name}</TableCell>
              <TableCell className="hidden sm:table-cell">{garment.size}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPrice(garment.purchasePrice)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPrice(garment.salePrice)}
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
                <div className="flex justify-center space-x-2">
                  {!garment.isSold && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsSold(garment.id, garment.name)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:ml-1 sm:inline">Vendido</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(garment.id, garment.name)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:ml-1 sm:inline">Eliminar</span>
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
