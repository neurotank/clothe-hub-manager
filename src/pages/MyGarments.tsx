import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import EditGarmentModal from '../components/EditGarmentModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Garment } from '../types';

const MyGarments: React.FC = () => {
  const { user } = useAuth();
  const { garments, loading, addGarment, editGarment, deleteGarment } = useSupabaseData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: string | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  const [editGarmentModal, setEditGarmentModal] = useState<{
    open: boolean;
    garment: Garment | null;
  }>({ open: false, garment: null });

  // Filtrar solo las prendas del usuario actual
  const userGarments = garments.filter(garment => 
    user && garment.user_id === user.id
  );

  const handleAddGarment = async (supplierId: string, garmentData: any) => {
    if (!user) return;
    await addGarment(supplierId, garmentData);
  };

  const handleDeleteClick = (garmentId: string, garmentName: string) => {
    setDeleteDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.garmentId) return;
    await deleteGarment(deleteDialog.garmentId);
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
  };

  const handleEditClick = (garment: Garment) => {
    setEditGarmentModal({
      open: true,
      garment
    });
  };

  const handleEditGarment = async (garmentData: any) => {
    if (!editGarmentModal.garment) return;
    
    try {
      await editGarment(editGarmentModal.garment.id, garmentData);
      // Close modal after successful edit
      setEditGarmentModal({ open: false, garment: null });
    } catch (error) {
      console.error('Error editing garment:', error);
      // Keep modal open on error so user can retry
    }
  };

  // Filtrar prendas
  const filteredGarments = userGarments.filter(garment => {
    const matchesSearch = 
      garment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'available' && !garment.is_sold) ||
      (statusFilter === 'sold' && garment.is_sold) ||
      (statusFilter === 'pending_payment' && garment.payment_status === 'pending') ||
      (statusFilter === 'paid' && garment.payment_status === 'paid');

    return matchesSearch && matchesStatus;
  });

  const availableGarments = userGarments.filter(g => !g.is_sold);
  const soldGarments = userGarments.filter(g => g.is_sold);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Cargando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Prendas</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
              {availableGarments.length} disponibles
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {soldGarments.length} vendidas
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">Inventario</h2>
          <AddGarmentModal supplierId="" onAddGarment={handleAddGarment} />
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              Mis Prendas
              {filteredGarments.length !== userGarments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {userGarments.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userGarments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No tienes prendas registradas
                </p>
                <AddGarmentModal supplierId="" onAddGarment={handleAddGarment} />
              </div>
            ) : (
              <GarmentsTable 
                garments={filteredGarments}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                hideActions={['markAsSold', 'markAsPaid']}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.garmentName}
      />

      <EditGarmentModal
        open={editGarmentModal.open}
        onOpenChange={(open) => setEditGarmentModal(prev => ({ ...prev, open }))}
        garment={editGarmentModal.garment}
        onEditGarment={handleEditGarment}
      />
    </div>
  );
};

export default MyGarments;
