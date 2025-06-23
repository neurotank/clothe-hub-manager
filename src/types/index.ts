
export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  user_id?: string;
  created_at?: string;
}

export interface Garment {
  id: string;
  supplier_id?: string;
  user_id?: string;
  code: string;
  name: string;
  size: string;
  purchase_price: number;
  sale_price: number;
  is_sold: boolean;
  payment_status: 'not_available' | 'pending' | 'paid';
  created_at: string;
  sold_at?: string;
}

export interface GarmentFormData {
  code: string;
  name: string;
  size: string;
  purchase_price: number;
  sale_price: number;
}

export interface SupplierFormData {
  name: string;
  phone: string;
  address: string;
  email: string;
}
