
import { useState } from 'react';
import { Supplier } from '../types';
import { useSupabaseData } from './useSupabaseData';

export const useDashboardLogic = () => {
  const {
    suppliers,
    garments,
    addSupplier,
    editSupplier,
    deleteSupplier,
    loading
  } = useSupabaseData();

  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddSupplier = async (supplierData: any) => {
    const result = await addSupplier(supplierData);
    if (result) {
      setShowAddSupplier(false);
    }
    return result;
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEditSupplier(true);
  };

  const handleSaveEditSupplier = async (supplierId: string, data: { name: string; surname: string; phone: string }) => {
    await editSupplier(supplierId, data);
    setShowEditSupplier(false);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplier) {
      await deleteSupplier(selectedSupplier.id);
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    `${supplier.name} ${supplier.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  // Paginación
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  return {
    // Data
    suppliers,
    garments,
    loading,
    currentSuppliers,
    filteredSuppliers,
    
    // Modal states
    showAddSupplier,
    showEditSupplier,
    showDeleteDialog,
    selectedSupplier,
    
    // Search and pagination
    searchTerm,
    currentPage,
    totalPages,
    
    // Handlers
    setShowAddSupplier,
    setShowEditSupplier,
    setShowDeleteDialog,
    setSelectedSupplier,
    setSearchTerm,
    setCurrentPage,
    handleAddSupplier,
    handleEditSupplier,
    handleSaveEditSupplier,
    handleDeleteSupplier,
    handleConfirmDelete
  };
};
