
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
      // Migrar datos existentes para incluir paymentStatus y soldAt
      const migratedGarments = parsedGarments.map((garment: any) => ({
        ...garment,
        paymentStatus: garment.paymentStatus || (garment.isSold ? 'pending' : 'not_available'),
        soldAt: garment.soldAt || (garment.isSold ? new Date().toISOString() : undefined)
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
      id: Date.now(),
      ...supplierData,
    };

    const updatedSuppliers = [...suppliers, newSupplier];
    saveSuppliers(updatedSuppliers);
    console.log('New supplier added:', newSupplier);
    return newSupplier;
  };

  const addGarment = (supplierId: number, garmentData: GarmentFormData) => {
    const newGarment: Garment = {
      id: Date.now(),
      supplierId,
      ...garmentData,
      isSold: false,
      paymentStatus: 'not_available',
      createdAt: new Date().toISOString(),
    };

    const updatedGarments = [...garments, newGarment];
    saveGarments(updatedGarments);
    console.log('New garment added:', newGarment);
  };

  const markAsSold = (garmentId: number) => {
    const updatedGarments = garments.map(garment =>
      garment.id === garmentId ? { 
        ...garment, 
        isSold: true, 
        paymentStatus: 'pending' as const,
        soldAt: new Date().toISOString()
      } : garment
    );
    saveGarments(updatedGarments);
    console.log('Garment marked as sold:', garmentId);
  };

  const markAsPaid = (garmentId: number) => {
    const updatedGarments = garments.map(garment =>
      garment.id === garmentId ? { 
        ...garment, 
        paymentStatus: 'paid' as const
      } : garment
    );
    saveGarments(updatedGarments);
    console.log('Garment marked as paid:', garmentId);
  };

  const deleteGarment = (garmentId: number) => {
    const updatedGarments = garments.filter(garment => garment.id !== garmentId);
    saveGarments(updatedGarments);
    console.log('Garment deleted:', garmentId);
  };

  const getGarmentsBySupplier = (supplierId: number) => {
    return garments.filter(garment => garment.supplierId === supplierId);
  };

  const getAllSoldGarments = () => {
    return garments.filter(garment => garment.isSold);
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
