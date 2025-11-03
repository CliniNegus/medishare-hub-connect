-- Add soft delete columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deletion_initiated_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS can_restore_until TIMESTAMP WITH TIME ZONE;

-- Create admin actions audit table
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_user_email TEXT,
  target_user_name TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Admin actions policies
CREATE POLICY "Admins can view admin actions"
ON public.admin_actions
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can insert admin actions"
ON public.admin_actions
FOR INSERT
WITH CHECK (is_admin());

-- Function to initiate soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_account(
  target_user_id UUID,
  grace_period_days INTEGER DEFAULT 7
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Update profile to mark as deleted
  UPDATE public.profiles
  SET 
    is_deleted = TRUE,
    deleted_at = now(),
    deletion_initiated_by = current_user_id,
    can_restore_until = now() + (grace_period_days || ' days')::INTERVAL
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Function to restore soft-deleted account
CREATE OR REPLACE FUNCTION public.restore_deleted_account(
  target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if account can be restored
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = target_user_id
    AND is_deleted = TRUE
    AND can_restore_until > now()
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Restore the account
  UPDATE public.profiles
  SET 
    is_deleted = FALSE,
    deleted_at = NULL,
    deletion_initiated_by = NULL,
    can_restore_until = NULL
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Function to permanently delete account and related data
CREATE OR REPLACE FUNCTION public.permanent_delete_account(
  target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  target_role TEXT;
  current_user_role TEXT;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get roles
  SELECT role INTO target_role FROM public.profiles WHERE id = target_user_id;
  SELECT role INTO current_user_role FROM public.profiles WHERE id = current_user_id;
  
  -- Prevent self-deletion
  IF current_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;
  
  -- Prevent admin deletion by non-super-admin
  IF target_role = 'admin' AND current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Insufficient permissions to delete admin account';
  END IF;
  
  -- Delete related data (maintain referential integrity)
  DELETE FROM public.bookings WHERE user_id = target_user_id;
  DELETE FROM public.orders WHERE user_id = target_user_id;
  DELETE FROM public.notifications WHERE user_id = target_user_id;
  DELETE FROM public.support_requests WHERE user_id = target_user_id;
  DELETE FROM public.investments WHERE investor_id = target_user_id;
  DELETE FROM public.leases WHERE hospital_id = target_user_id OR investor_id = target_user_id;
  DELETE FROM public.maintenance WHERE created_by = target_user_id;
  DELETE FROM public.equipment WHERE owner_id = target_user_id;
  DELETE FROM public.manufacturer_shops WHERE manufacturer_id = target_user_id;
  DELETE FROM public.customers WHERE user_id = target_user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Delete from auth.users (this will cascade)
  DELETE FROM auth.users WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param TEXT,
  target_user_id_param UUID,
  details_param JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_id UUID;
  target_email TEXT;
  target_name TEXT;
BEGIN
  -- Get target user details
  SELECT email, full_name INTO target_email, target_name
  FROM public.profiles
  WHERE id = target_user_id_param;
  
  INSERT INTO public.admin_actions (
    admin_id,
    action_type,
    target_user_id,
    target_user_email,
    target_user_name,
    details
  ) VALUES (
    auth.uid(),
    action_type_param,
    target_user_id_param,
    target_email,
    target_name,
    details_param
  ) RETURNING id INTO action_id;
  
  RETURN action_id;
END;
$$;

-- Create index for soft-deleted accounts cleanup
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_cleanup 
ON public.profiles(deleted_at, can_restore_until) 
WHERE is_deleted = TRUE;

-- Update profiles RLS to exclude soft-deleted accounts from normal views
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id AND (is_deleted = FALSE OR is_deleted IS NULL));

DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
USING ((auth.uid() = id OR is_admin()) AND (is_deleted = FALSE OR is_deleted IS NULL OR is_admin()));