-- Add visibility status enum type
DO $$ BEGIN
  CREATE TYPE visibility_status AS ENUM ('hidden', 'visible_all', 'visible_hospitals', 'visible_investors');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add visibility fields to equipment table
ALTER TABLE public.equipment
ADD COLUMN IF NOT EXISTS visibility_status text DEFAULT 'hidden' CHECK (visibility_status IN ('hidden', 'visible_all', 'visible_hospitals', 'visible_investors')),
ADD COLUMN IF NOT EXISTS visibility_updated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS visibility_updated_at timestamp with time zone;

-- Add visibility fields to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS visibility_status text DEFAULT 'hidden' CHECK (visibility_status IN ('hidden', 'visible_all', 'visible_hospitals', 'visible_investors')),
ADD COLUMN IF NOT EXISTS visibility_updated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS visibility_updated_at timestamp with time zone;

-- Create index for faster visibility filtering
CREATE INDEX IF NOT EXISTS idx_equipment_visibility ON public.equipment(visibility_status);
CREATE INDEX IF NOT EXISTS idx_products_visibility ON public.products(visibility_status);

-- Function to update visibility (admin only)
CREATE OR REPLACE FUNCTION public.update_equipment_visibility(
  equipment_id uuid,
  new_visibility text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can update visibility settings';
  END IF;
  
  -- Validate visibility status
  IF new_visibility NOT IN ('hidden', 'visible_all', 'visible_hospitals', 'visible_investors') THEN
    RAISE EXCEPTION 'Invalid visibility status';
  END IF;
  
  -- Update the equipment visibility
  UPDATE public.equipment
  SET 
    visibility_status = new_visibility,
    visibility_updated_by = auth.uid(),
    visibility_updated_at = now(),
    updated_at = now()
  WHERE id = equipment_id;
  
  -- Create notification for manufacturer if visibility changes to visible
  IF new_visibility != 'hidden' THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    SELECT 
      owner_id,
      'Equipment Visibility Updated',
      'Your equipment "' || name || '" is now visible to ' || 
        CASE new_visibility 
          WHEN 'visible_all' THEN 'all users'
          WHEN 'visible_hospitals' THEN 'hospitals'
          WHEN 'visible_investors' THEN 'investors'
        END,
      'success',
      '/equipment'
    FROM public.equipment
    WHERE id = equipment_id AND owner_id IS NOT NULL;
  ELSE
    -- Notify when hidden
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    SELECT 
      owner_id,
      'Equipment Visibility Changed',
      'Your equipment "' || name || '" has been set to hidden pending review',
      'warning',
      '/equipment'
    FROM public.equipment
    WHERE id = equipment_id AND owner_id IS NOT NULL;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to update product visibility (admin only)
CREATE OR REPLACE FUNCTION public.update_product_visibility(
  product_id uuid,
  new_visibility text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can update visibility settings';
  END IF;
  
  -- Validate visibility status
  IF new_visibility NOT IN ('hidden', 'visible_all', 'visible_hospitals', 'visible_investors') THEN
    RAISE EXCEPTION 'Invalid visibility status';
  END IF;
  
  -- Update the product visibility
  UPDATE public.products
  SET 
    visibility_status = new_visibility,
    visibility_updated_by = auth.uid(),
    visibility_updated_at = now(),
    updated_at = now()
  WHERE id = product_id;
  
  -- Create notification for manufacturer if visibility changes to visible
  IF new_visibility != 'hidden' THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    SELECT 
      manufacturer_id,
      'Product Visibility Updated',
      'Your product "' || name || '" is now visible to ' || 
        CASE new_visibility 
          WHEN 'visible_all' THEN 'all users'
          WHEN 'visible_hospitals' THEN 'hospitals'
          WHEN 'visible_investors' THEN 'investors'
        END,
      'success',
      '/shop'
    FROM public.products
    WHERE id = product_id AND manufacturer_id IS NOT NULL;
  ELSE
    -- Notify when hidden
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    SELECT 
      manufacturer_id,
      'Product Visibility Changed',
      'Your product "' || name || '" has been set to hidden pending review',
      'warning',
      '/shop'
    FROM public.products
    WHERE id = product_id AND manufacturer_id IS NOT NULL;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to check if user can view equipment based on visibility
CREATE OR REPLACE FUNCTION public.can_view_equipment(equipment_row equipment)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Admins can see everything
  IF is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Owners can see their own equipment
  IF equipment_row.owner_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  
  -- Get user role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Check visibility based on status
  CASE equipment_row.visibility_status
    WHEN 'visible_all' THEN RETURN TRUE;
    WHEN 'visible_hospitals' THEN RETURN user_role = 'hospital';
    WHEN 'visible_investors' THEN RETURN user_role = 'investor';
    ELSE RETURN FALSE;
  END CASE;
END;
$$;

-- Function to check if user can view product based on visibility
CREATE OR REPLACE FUNCTION public.can_view_product(product_row products)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Admins can see everything
  IF is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Owners can see their own products
  IF product_row.manufacturer_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  
  -- Get user role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Check visibility based on status
  CASE product_row.visibility_status
    WHEN 'visible_all' THEN RETURN TRUE;
    WHEN 'visible_hospitals' THEN RETURN user_role = 'hospital';
    WHEN 'visible_investors' THEN RETURN user_role = 'investor';
    ELSE RETURN FALSE;
  END CASE;
END;
$$;

-- Update existing equipment to have default visibility (hidden for review)
UPDATE public.equipment SET visibility_status = 'hidden' WHERE visibility_status IS NULL;

-- Update existing products to have default visibility (hidden for review)
UPDATE public.products SET visibility_status = 'hidden' WHERE visibility_status IS NULL;