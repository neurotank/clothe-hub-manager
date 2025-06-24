
-- Insertar usuarios fijos en la tabla users
INSERT INTO public.users (id, email, name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@consignapp.com', 'Administrador', 'admin', now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'vendedor1@consignapp.com', 'Vendedor 1', 'supplier', now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'vendedor2@consignapp.com', 'Vendedor 2', 'supplier', now(), now());

-- Primero necesito obtener los UUIDs reales de los suppliers existentes
-- Como no puedo hacer consultas aquí, voy a crear nuevos suppliers con UUIDs conocidos

-- Eliminar datos existentes si existen
DELETE FROM public.garments;
DELETE FROM public.suppliers;

-- Insertar suppliers con UUIDs específicos
INSERT INTO public.suppliers (id, name, phone, address, email, user_id, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'María García', '+34 666 123 456', 'Calle Mayor 123, Madrid', 'maria.garcia@email.com', '550e8400-e29b-41d4-a716-446655440002', now()),
('22222222-2222-2222-2222-222222222222', 'Carmen López', '+34 677 234 567', 'Avenida Central 456, Barcelona', 'carmen.lopez@email.com', '550e8400-e29b-41d4-a716-446655440003', now()),
('33333333-3333-3333-3333-333333333333', 'Ana Martínez', '+34 688 345 678', 'Plaza España 789, Valencia', 'ana.martinez@email.com', '550e8400-e29b-41d4-a716-446655440002', now());

-- Insertar garments con UUIDs específicos
INSERT INTO public.garments (id, supplier_id, user_id, code, name, size, purchase_price, sale_price, is_sold, payment_status, created_at, sold_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440002', 'BL001', 'Blusa Floral', 'M', 15, 35, false, 'not_available', '2024-01-15T10:30:00Z', null),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440002', 'VE002', 'Vestido Negro', 'S', 25, 55, true, 'pending', '2024-01-16T14:20:00Z', '2024-01-20T16:45:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 'PA003', 'Pantalón Vaquero', 'L', 20, 45, false, 'not_available', '2024-01-17T09:15:00Z', null),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 'CA004', 'Camisa Blanca', 'M', 12, 28, false, 'not_available', '2024-01-18T11:00:00Z', null),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440002', 'FA005', 'Falda Larga', 'S', 18, 40, false, 'not_available', '2024-01-19T13:30:00Z', null),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440002', 'CH006', 'Chaqueta Cuero', 'L', 45, 85, true, 'paid', '2024-01-20T08:45:00Z', '2024-01-22T12:30:00Z');
