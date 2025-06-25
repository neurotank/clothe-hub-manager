
-- Eliminar todas las tablas existentes para empezar desde cero
DROP TABLE IF EXISTS public.garments CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Eliminar tipos enum existentes
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Crear tipos enum
CREATE TYPE public.app_role AS ENUM ('admin', 'supplier');
CREATE TYPE public.payment_status AS ENUM ('not_available', 'pending', 'paid');

-- Crear tabla users
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'supplier',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla suppliers
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla garments
CREATE TABLE public.garments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  purchase_price NUMERIC NOT NULL,
  sale_price NUMERIC NOT NULL,
  is_sold BOOLEAN DEFAULT false,
  payment_status payment_status DEFAULT 'not_available',
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS muy permisivas
CREATE POLICY "Allow all authenticated access to users" ON public.users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all authenticated access to suppliers" ON public.suppliers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all authenticated access to garments" ON public.garments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insertar usuarios fijos
INSERT INTO public.users (id, email, name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@consignapp.com', 'Administrador', 'admin', now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'vendedor1@consignapp.com', 'Vendedor 1', 'admin', now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'vendedor2@consignapp.com', 'Vendedor 2', 'admin', now(), now());

-- Insertar suppliers de ejemplo
INSERT INTO public.suppliers (id, name, surname, phone, user_id, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'María', 'García', '381 4743147', '550e8400-e29b-41d4-a716-446655440002', now()),
('22222222-2222-2222-2222-222222222222', 'Carmen', 'López', '381 5234567', '550e8400-e29b-41d4-a716-446655440003', now()),
('33333333-3333-3333-3333-333333333333', 'Ana', 'Martínez', '381 6345678', '550e8400-e29b-41d4-a716-446655440002', now());

-- Insertar prendas de ejemplo
INSERT INTO public.garments (id, supplier_id, user_id, code, name, size, purchase_price, sale_price, is_sold, payment_status, created_at, sold_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440002', 'BL001', 'Blusa Floral', 'M', 15, 35, false, 'not_available', '2024-01-15T10:30:00Z', null),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440002', 'VE002', 'Vestido Negro', 'S', 25, 55, true, 'pending', '2024-01-16T14:20:00Z', '2024-01-20T16:45:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 'PA003', 'Pantalón Vaquero', 'L', 20, 45, false, 'not_available', '2024-01-17T09:15:00Z', null),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 'CA004', 'Camisa Blanca', 'M', 12, 28, false, 'not_available', '2024-01-18T11:00:00Z', null),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440002', 'FA005', 'Falda Larga', 'S', 18, 40, false, 'not_available', '2024-01-19T13:30:00Z', null),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440002', 'CH006', 'Chaqueta Cuero', 'L', 45, 85, true, 'paid', '2024-01-20T08:45:00Z', '2024-01-22T12:30:00Z');
