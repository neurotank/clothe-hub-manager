
import { useState, useEffect } from 'react';
import { Supplier, Garment, GarmentFormData } from '../types';
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
      setGarments(JSON.parse(savedGarments));
    } else {
      setGarments(mockGarments);
      localStorage.setItem('garments', JSON.stringify(mockGarments));
    }
  }, []);

  const saveGarments = (newGarments: Garment[]) => {
    setGarments(newGarments);
    localStorage.setItem('garments', JSON.stringify(newGarments));
  };

  const addGarment = (supplierId: number, garmentData: GarmentFormData) => {
    const newGarment: Garment = {
      id: Date.now(), // Simple ID generation
      supplierId,
      ...garmentData,
      isSold: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedGarments = [...garments, newGarment];
    saveGarments(updatedGarments);
    console.log('New garment added:', newGarment);
  };

  const markAsSold = (garmentId: number) => {
    const updatedGarments = garments.map(garment =>
      garment.id === garmentId ? { ...garment, isSold: true } : garment
    );
    saveGarments(updatedGarments);
    console.log('Garment marked as sold:', garmentId);
  };

  const deleteGarment = (garmentId: number) => {
    const updatedGarments = garments.filter(garment => garment.id !== garmentId);
    saveGarments(updatedGarments);
    console.log('Garment deleted:', garmentId);
  };

  const getGarmentsBySupplier = (supplierId: number) => {
    return garments.filter(garment => garment.supplierId === supplierId);
  };

  return {
    suppliers,
    garments,
    addGarment,
    markAsSold,
    deleteGarment,
    getGarmentsBySupplier
  };
};
