
-- Actualizar la tabla suppliers para incluir surname y remover campos no necesarios
ALTER TABLE public.suppliers 
ADD COLUMN surname text NOT NULL DEFAULT '';

-- Actualizar datos existentes para separar nombre y apellido
UPDATE public.suppliers 
SET surname = CASE 
  WHEN name LIKE '% %' THEN 
    TRIM(SUBSTRING(name FROM POSITION(' ' IN name) + 1))
  ELSE 
    'Sin Apellido'
END,
name = CASE 
  WHEN name LIKE '% %' THEN 
    TRIM(SUBSTRING(name FROM 1 FOR POSITION(' ' IN name) - 1))
  ELSE 
    name
END;

-- Remover columnas que ya no necesitamos
ALTER TABLE public.suppliers 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS address;

-- Actualizar los datos de ejemplo para que tengan el formato correcto de teléfono
UPDATE public.suppliers 
SET phone = CASE id
  WHEN '11111111-1111-1111-1111-111111111111' THEN '381 4743147'
  WHEN '22222222-2222-2222-2222-222222222222' THEN '381 5234567'
  WHEN '33333333-3333-3333-3333-333333333333' THEN '381 6345678'
  ELSE phone
END;
