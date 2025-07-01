
import React, { useState } from 'react';
import { Supplier } from '../types';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Pen, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useIsMobile } from '../hooks/use-mobile';
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
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (supplierId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(supplierId)) {
      newExpanded.delete(supplierId);
    } else {
      newExpanded.add(supplierId);
    }
    setExpandedRows(newExpanded);
  };

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
                  {isMobile && <TableHead className="w-8"></TableHead>}
                  <TableHead className="min-w-[150px]">Nombre</TableHead>
                  {!isMobile && <TableHead className="min-w-[150px]">Apellido</TableHead>}
                  <TableHead className="min-w-[120px]">Teléfono</TableHead>
                  {!isMobile && <TableHead className="min-w-[130px]">Fecha de Registro</TableHead>}
                  <TableHead className="text-center min-w-[200px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <Collapsible
                    key={supplier.id}
                    open={expandedRows.has(supplier.id)}
                    onOpenChange={() => toggleRow(supplier.id)}
                    asChild
                  >
                    <>
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        {isMobile && (
                          <TableCell className="w-8 p-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                {expandedRows.has(supplier.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                        )}
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            {isMobile && (
                              <div className="text-xs text-gray-500 mt-1">
                                {supplier.surname}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        {!isMobile && <TableCell>{supplier.surname}</TableCell>}
                        <TableCell>{supplier.phone}</TableCell>
                        {!isMobile && <TableCell>{formatDate(supplier.created_at)}</TableCell>}
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onSupplierClick(supplier.id)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {isMobile ? 'Ver' : 'Ver Detalles'}
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
                              {isMobile ? 'Del' : 'Eliminar'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isMobile && (
                        <TableRow>
                          <TableCell colSpan={4} className="p-0">
                            <CollapsibleContent>
                              <div className="px-4 py-3 bg-gray-50 border-t">
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-600">Fecha de Registro:</span>
                                    <div className="text-gray-700">
                                      {formatDate(supplier.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  </Collapsible>
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
