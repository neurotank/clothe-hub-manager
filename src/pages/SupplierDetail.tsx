
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import SupplierInfo from '../components/SupplierInfo';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SellConfirmDialog from '../components/SellConfirmDialog';
import { useDataStore } from '../hooks/useDataStore';
import { useToast } from '@/hooks/use-toast';
import { sendWhatsAppMessage } from '../utils/whatsappUtils';

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

  const [sellDialog, setSellDialog] = useState<{
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

  const handleMarkAsSoldClick = (garmentId: number, garmentName: string) => {
    setSellDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleSellConfirm = () => {
    if (sellDialog.garmentId && supplier) {
      const garment = garments.find(g => g.id === sellDialog.garmentId);
      if (garment) {
        markAsSold(sellDialog.garmentId);
        
        // Enviar mensaje de WhatsApp
        sendWhatsAppMessage(supplier, garment);
        
        toast({
          title: "Prenda vendida",
          description: `${sellDialog.garmentName} marcada como vendida y mensaje de WhatsApp enviado`,
        });
      }
    }
    setSellDialog({ open: false, garmentId: null, garmentName: '' });
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
          
          <SupplierInfo supplier={supplier} />
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
              <GarmentsTable 
                garments={garments}
                onMarkAsSold={handleMarkAsSoldClick}
                onDelete={handleDeleteClick}
              />
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

      <SellConfirmDialog
        open={sellDialog.open}
        onOpenChange={(open) => setSellDialog(prev => ({ ...prev, open }))}
        onConfirm={handleSellConfirm}
        garmentName={sellDialog.garmentName}
      />
    </div>
  );
};

export default SupplierDetail;
