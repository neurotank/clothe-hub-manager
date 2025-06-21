
import { Supplier, Garment } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'María González',
    phone: '+54 11 1234-5678',
    address: 'Av. Corrientes 1234, CABA',
    email: 'maria.gonzalez@email.com'
  },
  {
    id: 2,
    name: 'Juan Pérez',
    phone: '+54 11 2345-6789',
    address: 'Av. Santa Fe 5678, CABA',
    email: 'juan.perez@email.com'
  },
  {
    id: 3,
    name: 'Ana Rodríguez',
    phone: '+54 11 3456-7890',
    address: 'Av. Belgrano 9012, CABA',
    email: 'ana.rodriguez@email.com'
  },
  {
    id: 4,
    name: 'Carlos López',
    phone: '+54 11 4567-8901',
    address: 'Av. Rivadavia 3456, CABA',
    email: 'carlos.lopez@email.com'
  }
];

export const mockGarments: Garment[] = [
  {
    id: 1,
    supplierId: 1,
    code: 'REM001',
    name: 'Remera básica blanca',
    size: 'M',
    purchasePrice: 1500,
    salePrice: 3000,
    isSold: false,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    supplierId: 1,
    code: 'REM002',
    name: 'Remera negra estampada',
    size: 'L',
    purchasePrice: 2000,
    salePrice: 4000,
    isSold: true,
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    supplierId: 1,
    code: 'PAN001',
    name: 'Pantalón jean azul',
    size: '32',
    purchasePrice: 4000,
    salePrice: 8000,
    isSold: false,
    createdAt: '2024-01-17'
  },
  {
    id: 4,
    supplierId: 2,
    code: 'VES001',
    name: 'Vestido floreado',
    size: 'S',
    purchasePrice: 3500,
    salePrice: 7000,
    isSold: false,
    createdAt: '2024-01-18'
  },
  {
    id: 5,
    supplierId: 2,
    code: 'CAM001',
    name: 'Camisa blanca formal',
    size: 'M',
    purchasePrice: 2500,
    salePrice: 5000,
    isSold: false,
    createdAt: '2024-01-19'
  },
  {
    id: 6,
    supplierId: 3,
    code: 'BUZ001',
    name: 'Buzo con capucha',
    size: 'L',
    purchasePrice: 3000,
    salePrice: 6000,
    isSold: true,
    createdAt: '2024-01-20'
  }
];
