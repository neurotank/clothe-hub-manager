
-- Actualizar los emails de los usuarios existentes para que terminen en @stockmanager.com
-- Mantener el prefijo del email original pero cambiar el dominio

-- Actualizar la tabla users de la aplicación
UPDATE public.users 
SET email = CASE 
  WHEN email = 'admin@consignapp.com' THEN 'admin@stockmanager.com'
  WHEN email = 'vendedor1@consignapp.com' THEN 'vendedor1@stockmanager.com'
  WHEN email = 'vendedor2@consignapp.com' THEN 'vendedor2@stockmanager.com'
  ELSE REPLACE(email, '@consignapp.com', '@stockmanager.com')
END
WHERE email LIKE '%@consignapp.com';

-- Si hay usuarios en auth.users que necesiten ser actualizados también
-- (esto requerirá permisos de administrador en Supabase)
-- UPDATE auth.users 
-- SET email = CASE 
--   WHEN email = 'admin@consignapp.com' THEN 'admin@stockmanager.com'
--   WHEN email = 'vendedor1@consignapp.com' THEN 'vendedor1@stockmanager.com'
--   WHEN email = 'vendedor2@consignapp.com' THEN 'vendedor2@stockmanager.com'
--   ELSE REPLACE(email, '@consignapp.com', '@stockmanager.com')
-- END
-- WHERE email LIKE '%@consignapp.com';
