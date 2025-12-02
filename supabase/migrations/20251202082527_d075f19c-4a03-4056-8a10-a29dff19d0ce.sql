-- Add manufacturer_id to products table to track ownership
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS manufacturer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_manufacturer_id ON public.products(manufacturer_id);

-- Update RLS policies for products table

-- Drop existing policies
DROP POLICY IF EXISTS "Products admin write" ON public.products;
DROP POLICY IF EXISTS "Products public read" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;

-- Manufacturers can view their own products
CREATE POLICY "Manufacturers can view own products"
ON public.products
FOR SELECT
TO authenticated
USING (
  auth.uid() = manufacturer_id 
  OR is_admin()
);

-- Hospitals and investors can view all products
CREATE POLICY "Hospitals and investors can view all products"
ON public.products
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND role IN ('hospital', 'investor')
  )
);

-- Manufacturers can insert their own products
CREATE POLICY "Manufacturers can insert own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = manufacturer_id
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND role = 'manufacturer'
  )
);

-- Manufacturers can update their own products
CREATE POLICY "Manufacturers can update own products"
ON public.products
FOR UPDATE
TO authenticated
USING (auth.uid() = manufacturer_id)
WITH CHECK (auth.uid() = manufacturer_id);

-- Manufacturers can delete their own products
CREATE POLICY "Manufacturers can delete own products"
ON public.products
FOR DELETE
TO authenticated
USING (auth.uid() = manufacturer_id);

-- Admins can manage all products
CREATE POLICY "Admins can manage all products"
ON public.products
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());