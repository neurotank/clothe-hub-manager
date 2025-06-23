
import { Supplier, Garment } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "María García",
    phone: "+34 666 123 456",
    address: "Calle Mayor 123, Madrid",
    email: "maria.garcia@email.com"
  },
  {
    id: "2",
    name: "Carmen López",
    phone: "+34 677 234 567",
    address: "Avenida Central 456, Barcelona",
    email: "carmen.lopez@email.com"
  },
  {
    id: "3",
    name: "Ana Martínez",
    phone: "+34 688 345 678",
    address: "Plaza España 789, Valencia",
    email: "ana.martinez@email.com"
  }
];

export const mockGarments: Garment[] = [
  {
    id: "1",
    supplier_id: "1",
    code: "BL001",
    name: "Blusa Floral",
    size: "M",
    purchase_price: 15,
    sale_price: 35,
    is_sold: false,
    payment_status: 'not_available',
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    supplier_id: "1",
    code: "VE002",
    name: "Vestido Negro",
    size: "S",
    purchase_price: 25,
    sale_price: 55,
    is_sold: true,
    payment_status: 'pending',
    created_at: "2024-01-16T14:20:00Z",
    sold_at: "2024-01-20T16:45:00Z"
  },
  {
    id: "3",
    supplier_id: "2",
    code: "PA003",
    name: "Pantalón Vaquero",
    size: "L",
    purchase_price: 20,
    sale_price: 45,
    is_sold: false,
    payment_status: 'not_available',
    created_at: "2024-01-17T09:15:00Z"
  },
  {
    id: "4",
    supplier_id: "2",
    code: "CA004",
    name: "Camisa Blanca",
    size: "M",
    purchase_price: 12,
    sale_price: 28,
    is_sold: false,
    payment_status: 'not_available',
    created_at: "2024-01-18T11:00:00Z"
  },
  {
    id: "5",
    supplier_id: "3",
    code: "FA005",
    name: "Falda Larga",
    size: "S",
    purchase_price: 18,
    sale_price: 40,
    is_sold: false,
    payment_status: 'not_available',
    created_at: "2024-01-19T13:30:00Z"
  },
  {
    id: "6",
    supplier_id: "3",
    code: "CH006",
    name: "Chaqueta Cuero",
    size: "L",
    purchase_price: 45,
    sale_price: 85,
    is_sold: true,
    payment_status: 'paid',
    created_at: "2024-01-20T08:45:00Z",
    sold_at: "2024-01-22T12:30:00Z"
  }
];
