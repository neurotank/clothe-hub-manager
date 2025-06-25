
-- Enable realtime for suppliers table
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;

-- Enable realtime for garments table  
ALTER TABLE public.garments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.garments;
