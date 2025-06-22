
import { Supplier, Garment } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "María García",
    phone: "+34 666 123 456",
    address: "Calle Mayor 123, Madrid",
    email: "maria.garcia@email.com"
  },
  {
    id: 2,
    name: "Carmen López",
    phone: "+34 677 234 567",
    address: "Avenida Central 456, Barcelona",
    email: "carmen.lopez@email.com"
  },
  {
    id: 3,
    name: "Ana Martínez",
    phone: "+34 688 345 678",
    address: "Plaza España 789, Valencia",
    email: "ana.martinez@email.com"
  }
];

export const mockGarments: Garment[] = [
  {
    id: 1,
    supplierId: 1,
    code: "BL001",
    name: "Blusa Floral",
    size: "M",
    purchasePrice: 15,
    salePrice: 35,
    isSold: false,
    paymentStatus: 'not_available',
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    supplierId: 1,
    code: "VE002",
    name: "Vestido Negro",
    size: "S",
    purchasePrice: 25,
    salePrice: 55,
    isSold: true,
    paymentStatus: 'pending',
    createdAt: "2024-01-16T14:20:00Z",
    soldAt: "2024-01-20T16:45:00Z"
  },
  {
    id: 3,
    supplierId: 2,
    code: "PA003",
    name: "Pantalón Vaquero",
    size: "L",
    purchasePrice: 20,
    salePrice: 45,
    isSold: false,
    paymentStatus: 'not_available',
    createdAt: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    supplierId: 2,
    code: "CA004",
    name: "Camisa Blanca",
    size: "M",
    purchasePrice: 12,
    salePrice: 28,
    isSold: false,
    paymentStatus: 'not_available',
    createdAt: "2024-01-18T11:00:00Z"
  },
  {
    id: 5,
    supplierId: 3,
    code: "FA005",
    name: "Falda Larga",
    size: "S",
    purchasePrice: 18,
    salePrice: 40,
    isSold: false,
    paymentStatus: 'not_available',
    createdAt: "2024-01-19T13:30:00Z"
  },
  {
    id: 6,
    supplierId: 3,
    code: "CH006",
    name: "Chaqueta Cuero",
    size: "L",
    purchasePrice: 45,
    salePrice: 85,
    isSold: true,
    paymentStatus: 'paid',
    createdAt: "2024-01-20T08:45:00Z",
    soldAt: "2024-01-22T12:30:00Z"
  }
];
