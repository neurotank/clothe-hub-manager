import { Supplier, Garment } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "María",
    surname: "García",
    phone: "381 4743147",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Carmen",
    surname: "López",
    phone: "381 5234567",
    user_id: "550e8400-e29b-41d4-a716-446655440003",
    created_at: "2024-01-16T10:30:00Z"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Ana",
    surname: "Martínez",
    phone: "381 6345678",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2024-01-17T10:30:00Z"
  }
];

export const mockGarments: Garment[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    supplier_id: "11111111-1111-1111-1111-111111111111",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
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
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    supplier_id: "11111111-1111-1111-1111-111111111111",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
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
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    supplier_id: "22222222-2222-2222-2222-222222222222",
    user_id: "550e8400-e29b-41d4-a716-446655440003",
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
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    supplier_id: "22222222-2222-2222-2222-222222222222",
    user_id: "550e8400-e29b-41d4-a716-446655440003",
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
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    supplier_id: "33333333-3333-3333-3333-333333333333",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
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
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    supplier_id: "33333333-3333-3333-3333-333333333333",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
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
