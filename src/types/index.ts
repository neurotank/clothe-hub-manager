
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
  createdAt: string;
}

export interface GarmentFormData {
  code: string;
  name: string;
  size: string;
  purchasePrice: number;
  salePrice: number;
}
