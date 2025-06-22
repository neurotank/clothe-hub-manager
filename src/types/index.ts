export interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface Garment {
  id: number;
  supplierId: number;
  code: string;
  name: string;
  size: string;
  purchasePrice: number;
  salePrice: number;
  isSold: boolean;
  paymentStatus: 'not_available' | 'pending' | 'paid';
  createdAt: string;
  soldAt?: string;
}

export interface GarmentFormData {
  code: string;
  name: string;
  size: string;
  purchasePrice: number;
  salePrice: number;
}

export interface SupplierFormData {
  name: string;
  phone: string;
  address: string;
  email: string;
}
