
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
        <div className="w-full rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {isMobile && <TableHead className="w-8"></TableHead>}
                <TableHead className={isMobile ? "min-w-[120px]" : "min-w-[150px]"}>
                  {isMobile ? "Proveedor" : "Nombre"}
                </TableHead>
                <TableHead className={isMobile ? "min-w-[100px]" : "min-w-[150px]"}>
                  {isMobile ? "Contacto" : "Apellido"}
                </TableHead>
                {!isMobile && <TableHead className="min-w-[120px]">Teléfono</TableHead>}
                {!isMobile && <TableHead className="min-w-[130px]">Fecha de Registro</TableHead>}
                <TableHead className="text-center min-w-[120px]">Acciones</TableHead>
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
                        {isMobile ? (
                          <div>
                            <div className="font-medium text-sm">{supplier.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {supplier.surname}
                            </div>
                          </div>
                        ) : (
                          supplier.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isMobile ? (
                          <div className="text-sm">
                            {supplier.phone}
                          </div>
                        ) : (
                          supplier.surname
                        )}
                      </TableCell>
                      {!isMobile && <TableCell>{supplier.phone}</TableCell>}
                      {!isMobile && <TableCell>{formatDate(supplier.created_at)}</TableCell>}
                      <TableCell className="text-center">
                        <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'justify-center space-x-2'}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSupplierClick(supplier.id)}
                            className={`text-blue-600 border-blue-600 hover:bg-blue-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Ver Detalles</span>}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditSupplier(supplier)}
                            className={`text-green-600 border-green-600 hover:bg-green-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Editar</span>}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(supplier)}
                            className={`text-red-600 border-red-600 hover:bg-red-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Eliminar</span>}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isMobile && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <CollapsibleContent>
                            <div className="px-4 py-3 bg-gray-50 border-t">
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Nombre Completo:</span>
                                  <div className="text-gray-700 mt-1">
                                    {supplier.name} {supplier.surname}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Teléfono:</span>
                                  <div className="text-gray-700 mt-1">
                                    {supplier.phone}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Fecha de Registro:</span>
                                  <div className="text-gray-700 mt-1">
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
