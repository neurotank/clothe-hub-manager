
import React from 'react';
import { Supplier } from '../types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SuppliersTableProps {
  suppliers: Supplier[];
  onSupplierClick: (supplierId: string) => void;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ suppliers, onSupplierClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay proveedores registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow 
              key={supplier.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.surname}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{formatDate(supplier.created_at)}</TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSupplierClick(supplier.id)}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuppliersTable;
