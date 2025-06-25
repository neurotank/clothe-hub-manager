
-- Primero, verificar si los usuarios ya existen y manejar las referencias
DO $$
BEGIN
    -- Eliminar todas las políticas RLS existentes si existen
    DROP POLICY IF EXISTS "Users can view own data" ON public.users;
    DROP POLICY IF EXISTS "Users can view own suppliers" ON public.suppliers;
    DROP POLICY IF EXISTS "Users can insert own suppliers" ON public.suppliers;
    DROP POLICY IF EXISTS "Users can update own suppliers" ON public.suppliers;
    DROP POLICY IF EXISTS "Users can delete own suppliers" ON public.suppliers;
    DROP POLICY IF EXISTS "Users can view own garments" ON public.garments;
    DROP POLICY IF EXISTS "Users can insert own garments" ON public.garments;
    DROP POLICY IF EXISTS "Users can update own garments" ON public.garments;
    DROP POLICY IF EXISTS "Users can delete own garments" ON public.garments;
    
    -- Insertar usuarios solo si no existen
    INSERT INTO public.users (id, auth_user_id, email, name, role) 
    SELECT '550e8400-e29b-41d4-a716-446655440001', null, 'admin@consignapp.com', 'Admin', 'admin'
    WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@consignapp.com');
    
    INSERT INTO public.users (id, auth_user_id, email, name, role) 
    SELECT '550e8400-e29b-41d4-a716-446655440002', null, 'vendedor1@consignapp.com', 'Vendedor 1', 'supplier'
    WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'vendedor1@consignapp.com');
    
    INSERT INTO public.users (id, auth_user_id, email, name, role) 
    SELECT '550e8400-e29b-41d4-a716-446655440003', null, 'vendedor2@consignapp.com', 'Vendedor 2', 'supplier'
    WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'vendedor2@consignapp.com');
END $$;

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

-- Crear función para obtener el user_id basado en auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid();
$$;

-- Políticas para users - solo pueden ver su propio registro
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Políticas para suppliers - pueden ver/modificar sus propios proveedores
CREATE POLICY "Users can view own suppliers" ON public.suppliers
  FOR SELECT USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can insert own suppliers" ON public.suppliers
  FOR INSERT WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update own suppliers" ON public.suppliers
  FOR UPDATE USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can delete own suppliers" ON public.suppliers
  FOR DELETE USING (user_id = public.get_current_user_id());

-- Políticas para garments - pueden ver/modificar sus propias prendas
CREATE POLICY "Users can view own garments" ON public.garments
  FOR SELECT USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can insert own garments" ON public.garments
  FOR INSERT WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update own garments" ON public.garments
  FOR UPDATE USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can delete own garments" ON public.garments
  FOR DELETE USING (user_id = public.get_current_user_id());
