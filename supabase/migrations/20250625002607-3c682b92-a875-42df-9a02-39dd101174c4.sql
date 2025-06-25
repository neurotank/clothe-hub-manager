
-- Habilitar RLS en las tablas
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

-- Políticas para suppliers - todos los usuarios autenticados pueden ver y gestionar suppliers
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete suppliers" ON public.suppliers
  FOR DELETE TO authenticated USING (true);

-- Políticas para garments - todos los usuarios autenticados pueden ver y gestionar prendas
CREATE POLICY "Authenticated users can view garments" ON public.garments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert garments" ON public.garments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update garments" ON public.garments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete garments" ON public.garments
  FOR DELETE TO authenticated USING (true);
