
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Check, X } from 'lucide-react';
import Header from '../components/Header';
import AddGarmentModal from '../components/AddGarmentModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { useDataStore } from '../hooks/useDataStore';
import { useToast } from '@/hooks/use-toast';

const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { suppliers, addGarment, markAsSold, deleteGarment, getGarmentsBySupplier } = useDataStore();
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: number | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const supplierId = parseInt(id || '0');
  const supplier = suppliers.find(s => s.id === supplierId);
  const garments = getGarmentsBySupplier(supplierId);

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proveedor no encontrado</h2>
            <Button onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkAsSold = (garmentId: number, garmentName: string) => {
    markAsSold(garmentId);
    toast({
      title: "Prenda vendida",
      description: `${garmentName} marcada como vendida`,
    });
  };

  const handleDeleteClick = (garmentId: number, garmentName: string) => {
    setDeleteDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.garmentId) {
      deleteGarment(deleteDialog.garmentId);
      toast({
        title: "Prenda eliminada",
        description: `${deleteDialog.garmentName} eliminada del inventario`,
      });
    }
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const availableGarments = garments.filter(g => !g.isSold);
  const soldGarments = garments.filter(g => g.isSold);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{supplier.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{supplier.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{supplier.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Dirección:</span>
                <p className="text-gray-900">{supplier.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Prendas en Consignación</h2>
            <div className="flex space-x-4 text-sm">
              <span className="text-green-600 font-medium">
                {availableGarments.length} disponibles
              </span>
              <span className="text-gray-500">
                {soldGarments.length} vendidas
              </span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddGarmentModal supplierId={supplierId} onAddGarment={addGarment} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventario de Prendas</CardTitle>
          </CardHeader>
          <CardContent>
            {garments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No hay prendas registradas para este proveedor
                </p>
                <AddGarmentModal supplierId={supplierId} onAddGarment={addGarment} />
              </div>
            ) : (
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
                                onClick={() => handleMarkAsSold(garment.id, garment.name)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:ml-1 sm:inline">Vendido</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(garment.id, garment.name)}
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
            )}
          </CardContent>
        </Card>
      </main>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.garmentName}
      />
    </div>
  );
};

export default SupplierDetail;
