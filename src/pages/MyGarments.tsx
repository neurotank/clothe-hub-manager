
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../components/Header';
import GarmentsTable from '../components/GarmentsTable';
import AddGarmentModal from '../components/AddGarmentModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SearchAndFilters from '../components/SearchAndFilters';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Garment } from '../types';

const MyGarments: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending_payment' | 'paid'>('all');
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    garmentId: number | null;
    garmentName: string;
  }>({ open: false, garmentId: null, garmentName: '' });

  // Cargar prendas del supplier
  const loadGarments = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading garments:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las prendas",
        variant: "destructive",
      });
    } else {
      setGarments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGarments();
  }, [user]);

  const addGarment = async (garmentData: any) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('garments')
      .insert({
        ...garmentData,
        user_id: user.id,
        is_sold: false,
        payment_status: 'not_available',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding garment:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la prenda",
        variant: "destructive",
      });
    } else {
      setGarments(prev => [...prev, data]);
      toast({
        title: "Prenda agregada",
        description: "La prenda se agregó exitosamente",
      });
    }
  };

  const handleDeleteClick = (garmentId: number, garmentName: string) => {
    setDeleteDialog({
      open: true,
      garmentId,
      garmentName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.garmentId) return;

    const { error } = await supabase
      .from('garments')
      .delete()
      .eq('id', deleteDialog.garmentId);

    if (error) {
      console.error('Error deleting garment:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la prenda",
        variant: "destructive",
      });
    } else {
      setGarments(prev => prev.filter(g => g.id !== deleteDialog.garmentId));
      toast({
        title: "Prenda eliminada",
        description: `${deleteDialog.garmentName} eliminada del inventario`,
      });
    }
    
    setDeleteDialog({ open: false, garmentId: null, garmentName: '' });
  };

  // Filtrar prendas
  const filteredGarments = garments.filter(garment => {
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

  const availableGarments = garments.filter(g => !g.is_sold);
  const soldGarments = garments.filter(g => g.is_sold);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
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
          <AddGarmentModal supplierId={0} onAddGarment={addGarment} />
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
              {filteredGarments.length !== garments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {garments.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {garments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No tienes prendas registradas
                </p>
                <AddGarmentModal supplierId={0} onAddGarment={addGarment} />
              </div>
            ) : (
              <GarmentsTable 
                garments={filteredGarments}
                onDelete={handleDeleteClick}
                hideActions={['markAsSold', 'markAsPaid']}
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
    </div>
  );
};

export default MyGarments;
