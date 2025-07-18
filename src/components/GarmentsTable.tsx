import React, { useState } from 'react';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Check, X, DollarSign, Eye, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { Garment, Supplier } from '../types';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface GarmentsTableProps {
  garments: Garment[];
  onMarkAsSold?: (garmentId: string, garmentName: string) => void;
  onMarkAsPaid?: (garmentId: string, garmentName: string) => void;
  onDelete: (garmentId: string, garmentName: string) => void;
  onEdit?: (garment: Garment) => void;
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
  onEdit,
  hideActions = [],
  suppliers = [],
  showSupplierColumn = false,
  adminMode = false,
  supplier
}) => {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (garmentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(garmentId)) {
      newExpanded.delete(garmentId);
    } else {
      newExpanded.add(garmentId);
    }
    setExpandedRows(newExpanded);
  };

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

  const getPaymentTypeBadge = (paymentType?: string) => {
    if (!paymentType) return <span className="text-gray-400">-</span>;
    
    const typeMap = {
      'efectivo': { label: 'Efectivo', color: 'bg-green-100 text-green-800' },
      'qr': { label: 'QR', color: 'bg-blue-100 text-blue-800' },
      'debito': { label: 'Débito', color: 'bg-purple-100 text-purple-800' },
      'credito': { label: 'Crédito', color: 'bg-orange-100 text-orange-800' }
    };
    
    const typeInfo = typeMap[paymentType as keyof typeof typeMap];
    return (
      <Badge variant="secondary" className={typeInfo?.color || 'bg-gray-100 text-gray-600'}>
        {typeInfo?.label || paymentType}
      </Badge>
    );
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
    <div className="w-full">
      <div className="w-full rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {isMobile && <TableHead className="w-8"></TableHead>}
              <TableHead className={isMobile ? "min-w-[120px]" : "min-w-[100px]"}>
                {isMobile ? "Prenda" : "Código"}
              </TableHead>
              <TableHead className={isMobile ? "min-w-[100px]" : "min-w-[150px]"}>
                {isMobile ? "Estado" : "Nombre"}
              </TableHead>
              {!isMobile && <TableHead className="min-w-[80px]">Talle</TableHead>}
              {!isMobile && <TableHead className="min-w-[120px]">P. Compra</TableHead>}
              {!isMobile && <TableHead className="min-w-[120px]">P. Venta</TableHead>}
              {!isMobile && <TableHead className="min-w-[100px]">Estado</TableHead>}
              {!isMobile && showSupplierColumn && <TableHead className="min-w-[150px]">Proveedor</TableHead>}
              <TableHead className="text-center min-w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {garments.map((garment) => (
              <Collapsible
                key={garment.id}
                open={expandedRows.has(garment.id)}
                onOpenChange={() => toggleRow(garment.id)}
                asChild
              >
                <>
                  <TableRow 
                    className={`hover:bg-gray-50 ${garment.is_sold && garment.payment_status === 'paid' ? 'opacity-60' : ''}`}
                  >
                    {isMobile && (
                      <TableCell className="w-8 p-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            {expandedRows.has(garment.id) ? (
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
                          <div className="font-medium text-sm">{garment.code}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">
                            {garment.name}
                          </div>
                        </div>
                      ) : (
                        garment.code
                      )}
                    </TableCell>
                    <TableCell>
                      {isMobile ? (
                        <Badge 
                          variant={garment.is_sold ? "secondary" : "default"}
                          className={`text-xs ${garment.is_sold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}`}
                        >
                          {garment.is_sold ? 'Vendida' : 'Disponible'}
                        </Badge>
                      ) : (
                        garment.name
                      )}
                    </TableCell>
                    {!isMobile && <TableCell>{garment.size}</TableCell>}
                    {!isMobile && (
                      <TableCell>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(garment.purchase_price)}
                        </span>
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {formatPrice(garment.sale_price)}
                        </span>
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell className="text-center">
                        <Badge 
                          variant={garment.is_sold ? "secondary" : "default"}
                          className={garment.is_sold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}
                        >
                          {garment.is_sold ? 'Vendida' : 'Disponible'}
                        </Badge>
                      </TableCell>
                    )}
                    {!isMobile && showSupplierColumn && (
                      <TableCell>
                        {garment.supplier_id ? getSupplierName(garment.supplier_id) : 'N/A'}
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'flex-row justify-center space-x-2'}`}>
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(garment)}
                            className={`text-blue-600 border-blue-600 hover:bg-blue-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Editar</span>}
                          </Button>
                        )}
                        {!garment.is_sold && !hideActions.includes('markAsSold') && onMarkAsSold && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMarkAsSold(garment.id, garment.name)}
                            className={`text-green-600 border-green-600 hover:bg-green-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Vender</span>}
                          </Button>
                        )}
                        {garment.is_sold && garment.payment_status === 'pending' && !hideActions.includes('markAsPaid') && onMarkAsPaid && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMarkAsPaid(garment.id, garment.name)}
                            className={`text-blue-600 border-blue-600 hover:bg-blue-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                          >
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                            {!isMobile && <span className="ml-1">Pagar</span>}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(garment.id, garment.name)}
                          className={`text-red-600 border-red-600 hover:bg-red-50 ${isMobile ? 'text-xs px-2 py-1 h-auto min-h-[28px]' : ''}`}
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
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
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-600">Talle:</span> {garment.size}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">P. Compra:</span> <span className="font-semibold text-blue-600">{formatPrice(garment.purchase_price)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">P. Venta:</span> <span className="font-semibold text-green-600">{formatPrice(garment.sale_price)}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-600 mr-2">Estado Pago:</span>
                                {getPaymentBadge(garment.payment_status)}
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-600 mr-2">Tipo Pago:</span>
                                {getPaymentTypeBadge(garment.payment_type)}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Creado:</span> {formatDate(garment.created_at)}
                              </div>
                              {garment.sold_at && (
                                <div>
                                  <span className="font-medium text-gray-600">Vendido:</span> {formatDate(garment.sold_at)}
                                </div>
                              )}
                              {showSupplierColumn && garment.supplier_id && (
                                <div>
                                  <span className="font-medium text-gray-600">Proveedor:</span> {getSupplierName(garment.supplier_id)}
                                </div>
                              )}
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
  );
};

export default GarmentsTable;
