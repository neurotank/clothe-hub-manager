
export interface Supplier {
  id: string;
  name: string;
  surname: string;
  phone: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface SupplierFormData {
  name: string;
  surname: string;
  phone: string;
}

export interface Garment {
  id: string;
  supplier_id: string;
  code: string;
  name: string;
  size: string;
  purchase_price: number;
  sale_price: number;
  is_sold: boolean;
  sold_at?: string;
  payment_status: 'not_available' | 'pending' | 'paid';
  user_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface GarmentFormData {
  code: string;
  name: string;
  size: string;
  purchase_price: number;
  sale_price: number;
}

export type PaymentStatus = 'not_available' | 'pending' | 'paid';
export type UserRole = 'admin' | 'supplier';
