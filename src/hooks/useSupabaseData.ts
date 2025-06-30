
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from './useUserData';
import { useSuppliers } from './useSuppliers';
import { useGarments } from './useGarments';
import { useGarmentOperations } from './useGarmentOperations';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const { userRole, getUserData } = useUserData();
  
  const {
    suppliers,
    fetchSuppliers,
    addSupplier,
    editSupplier,
    deleteSupplier
  } = useSuppliers(getUserData);

  const {
    garments,
    fetchGarments,
    addGarment,
    editGarment,
    updateGarment,
    deleteGarment
  } = useGarments(getUserData);

  const { markAsSold, markAsPaid } = useGarmentOperations(fetchGarments);

  // Set up real-time subscriptions
  useRealtimeSubscriptions(fetchSuppliers, fetchGarments);

  // Load initial data
  useEffect(() => {
    if (user) {
      console.log('User found, loading initial data...');
      const loadData = async () => {
        setLoading(true);
        try {
          await getUserData();
          await Promise.all([fetchSuppliers(), fetchGarments()]);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      console.log('No user, clearing data...');
      setLoading(false);
    }
  }, [user?.id, fetchSuppliers, fetchGarments, getUserData]);

  const getGarmentsBySupplier = (supplierId: string) => {
    return garments.filter(garment => garment.supplier_id === supplierId);
  };

  const getAllSoldGarments = () => {
    return garments.filter(garment => garment.is_sold);
  };

  // Enhanced markAsSold that passes required data
  const enhancedMarkAsSold = async (garmentId: string, garmentName: string, paymentType: string) => {
    await markAsSold(garmentId, garmentName, garments, suppliers, paymentType);
  };

  // Enhanced deleteSupplier that passes garments data
  const enhancedDeleteSupplier = async (supplierId: string) => {
    await deleteSupplier(supplierId, garments);
  };

  return {
    suppliers,
    garments,
    loading,
    userRole,
    addSupplier,
    editSupplier,
    deleteSupplier: enhancedDeleteSupplier,
    addGarment,
    editGarment,
    updateGarment,
    markAsSold: enhancedMarkAsSold,
    markAsPaid,
    deleteGarment,
    getGarmentsBySupplier,
    getAllSoldGarments
  };
};
