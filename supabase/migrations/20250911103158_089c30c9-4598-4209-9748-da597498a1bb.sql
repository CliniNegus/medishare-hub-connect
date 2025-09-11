-- Fix equipment table RLS policies to allow proper access for all authenticated users

-- First, let's check what we're working with
-- Drop existing overly restrictive policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.equipment;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.equipment;
DROP POLICY IF EXISTS "Authenticated users can view basic equipment info" ON public.equipment;
DROP POLICY IF EXISTS "Equipment creation" ON public.equipment;
DROP POLICY IF EXISTS "Equipment owners and admins can view all data" ON public.equipment;
DROP POLICY IF EXISTS "Equipment updates" ON public.equipment;
DROP POLICY IF EXISTS "Equipment visibility" ON public.equipment;
DROP POLICY IF EXISTS "Manufacturers can create equipment" ON public.equipment;
DROP POLICY IF EXISTS "Manufacturers can update their equipment" ON public.equipment;

-- Create new, more appropriate policies

-- Allow all authenticated users to view equipment (for hospitals to browse)
CREATE POLICY "Authenticated users can view equipment" 
ON public.equipment 
FOR SELECT 
TO authenticated
USING (true);

-- Allow equipment owners to manage their equipment
CREATE POLICY "Equipment owners can manage their equipment" 
ON public.equipment 
FOR ALL 
TO authenticated
USING (auth.uid() = owner_id OR is_admin());

-- Allow manufacturers to create new equipment
CREATE POLICY "Manufacturers can create equipment" 
ON public.equipment 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = owner_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('manufacturer', 'admin')
  )
);

-- Allow manufacturers and admins to update equipment
CREATE POLICY "Manufacturers and admins can update equipment" 
ON public.equipment 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = owner_id OR 
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'manufacturer'
  )
);