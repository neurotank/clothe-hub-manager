
-- Crear tipo enum para los tipos de pago
CREATE TYPE public.payment_type AS ENUM ('efectivo', 'qr', 'debito', 'credito');

-- Agregar la columna payment_type a la tabla garments
ALTER TABLE public.garments 
ADD COLUMN payment_type payment_type;
