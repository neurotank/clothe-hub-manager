
import React, { useState } from 'react';
import { Supplier } from '../types';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Pen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DeleteSupplierDialog from './DeleteSupplierDialog';

interface SuppliersTableProps {
  suppliers: Supplier[];
  onSupplierClick: (supplierId: string) => void;
  onDeleteSupplier: (supplierId: string) => void;
  onEditSupplier: (supplier: Supplier) => void;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ 
  suppliers, 
  onSupplierClick, 
  onDeleteSupplier,
  onEditSupplier
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      onDeleteSupplier(supplierToDelete.id);
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay proveedores registrados</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <ScrollArea className="w-full rounded-md border">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nombre</TableHead>
                  <TableHead className="min-w-[150px]">Apellido</TableHead>
                  <TableHead className="min-w-[120px]">Teléfono</TableHead>
                  <TableHead className="min-w-[130px]">Fecha de Registro</TableHead>
                  <TableHead className="text-center min-w-[250px]">Acciones</TableHead>
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
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSupplierClick(supplier.id)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditSupplier(supplier)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Pen className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(supplier)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        supplierName={supplierToDelete ? `${supplierToDelete.name} ${supplierToDelete.surname}` : ''}
      />
    </>
  );
};

export default SuppliersTable;
