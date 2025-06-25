
-- Primero verificar si el usuario ya existe en auth.users
-- Si existe, solo necesitamos actualizar la tabla users
DO $$
BEGIN
  -- Verificar si el usuario ya existe en la tabla users con este auth_user_id
  IF EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = '550e8400-e29b-41d4-a716-446655440001') THEN
    -- El usuario ya existe, no hacer nada
    RAISE NOTICE 'User already exists with this auth_user_id';
  ELSE
    -- Si no existe, verificar si hay un usuario con el email pero sin auth_user_id
    IF EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@consignapp.com' AND auth_user_id IS NULL) THEN
      -- Actualizar el usuario existente
      UPDATE public.users 
      SET auth_user_id = '550e8400-e29b-41d4-a716-446655440001' 
      WHERE email = 'admin@consignapp.com' AND auth_user_id IS NULL;
    ELSE
      -- Crear un nuevo usuario si no existe
      INSERT INTO public.users (auth_user_id, email, name, role)
      VALUES ('550e8400-e29b-41d4-a716-446655440001', 'admin@consignapp.com', 'Admin User', 'admin');
    END IF;
  END IF;
END $$;
