
import { useState, useEffect } from 'react';
import { Supplier, Garment, GarmentFormData, SupplierFormData } from '../types';
import { mockSuppliers, mockGarments } from '../data/mockData';

export const useDataStore = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);

  useEffect(() => {
    // Cargar datos desde localStorage o usar datos mock
    const savedSuppliers = localStorage.getItem('suppliers');
    const savedGarments = localStorage.getItem('garments');

    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    } else {
      setSuppliers(mockSuppliers);
      localStorage.setItem('suppliers', JSON.stringify(mockSuppliers));
    }

    if (savedGarments) {
      const parsedGarments = JSON.parse(savedGarments);
      // Migrar datos existentes para incluir payment_status y sold_at
      const migratedGarments = parsedGarments.map((garment: any) => ({
        ...garment,
        payment_status: garment.payment_status || (garment.is_sold ? 'pending' : 'not_available'),
        sold_at: garment.sold_at || (garment.is_sold ? new Date().toISOString() : undefined)
      }));
      setGarments(migratedGarments);
      localStorage.setItem('garments', JSON.stringify(migratedGarments));
    } else {
      setGarments(mockGarments);
      localStorage.setItem('garments', JSON.stringify(mockGarments));
    }
  }, []);

  const saveSuppliers = (newSuppliers: Supplier[]) => {
    setSuppliers(newSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(newSuppliers));
  };

  const saveGarments = (newGarments: Garment[]) => {
    setGarments(newGarments);
    localStorage.setItem('garments', JSON.stringify(newGarments));
  };

  const addSupplier = (supplierData: SupplierFormData) => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      ...supplierData,
      created_at: new Date().toISOString(),
    };

    const updatedSuppliers = [...suppliers, newSupplier];
    saveSuppliers(updatedSuppliers);
    console.log('New supplier added:', newSupplier);
    return newSupplier;
  };

  const addGarment = (supplierId: string, garmentData: GarmentFormData) => {
    const newGarment: Garment = {
      id: Date.now().toString(),
      supplier_id: supplierId,
      ...garmentData,
      is_sold: false,
      payment_status: 'not_available',
      created_at: new Date().toISOString(),
    };

    const updatedGarments = [...garments, newGarment];
    saveGarments(updatedGarments);
    console.log('New garment added:', newGarment);
  };

  const markAsSold = (garmentId: string) => {
    const updatedGarments = garments.map(garment =>
      garment.id === garmentId ? { 
        ...garment, 
        is_sold: true, 
        payment_status: 'pending' as const,
        sold_at: new Date().toISOString()
      } : garment
    );
    saveGarments(updatedGarments);
    console.log('Garment marked as sold:', garmentId);
  };

  const markAsPaid = (garmentId: string) => {
    const updatedGarments = garments.map(garment =>
      garment.id === garmentId ? { 
        ...garment, 
        payment_status: 'paid' as const
      } : garment
    );
    saveGarments(updatedGarments);
    console.log('Garment marked as paid:', garmentId);
  };

  const deleteGarment = (garmentId: string) => {
    const updatedGarments = garments.filter(garment => garment.id !== garmentId);
    saveGarments(updatedGarments);
    console.log('Garment deleted:', garmentId);
  };

  const getGarmentsBySupplier = (supplierId: string) => {
    return garments.filter(garment => garment.supplier_id === supplierId);
  };

  const getAllSoldGarments = () => {
    return garments.filter(garment => garment.is_sold);
  };

  return {
    suppliers,
    garments,
    addSupplier,
    addGarment,
    markAsSold,
    markAsPaid,
    deleteGarment,
    getGarmentsBySupplier,
    getAllSoldGarments
  };
};
