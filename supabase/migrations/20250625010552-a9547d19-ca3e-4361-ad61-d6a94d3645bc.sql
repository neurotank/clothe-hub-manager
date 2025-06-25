
-- Eliminar las políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can insert suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can delete suppliers" ON public.suppliers;

DROP POLICY IF EXISTS "Authenticated users can view garments" ON public.garments;
DROP POLICY IF EXISTS "Authenticated users can insert garments" ON public.garments;
DROP POLICY IF EXISTS "Authenticated users can update garments" ON public.garments;
DROP POLICY IF EXISTS "Authenticated users can delete garments" ON public.garments;

-- Crear políticas que permitan a los usuarios autenticados acceder a todos los datos
-- (ya que vendedor1 y vendedor2 deben poder gestionar todos los suppliers)
CREATE POLICY "Allow authenticated users full access to suppliers" ON public.suppliers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to garments" ON public.garments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
