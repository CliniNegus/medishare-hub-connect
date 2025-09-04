-- Add SKU field to equipment table
ALTER TABLE public.equipment 
ADD COLUMN sku text;