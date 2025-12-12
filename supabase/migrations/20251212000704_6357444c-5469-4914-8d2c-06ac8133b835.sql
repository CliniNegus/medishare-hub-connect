-- =====================================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- =====================================================

-- 1. FIX PLATFORM_SHOWCASES RLS - Restrict to admins only
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can manage platform showcases" ON public.platform_showcases;
DROP POLICY IF EXISTS "Platform showcases are publicly readable" ON public.platform_showcases;

-- Only admins can manage platform showcases
CREATE POLICY "Admins can manage platform showcases"
ON public.platform_showcases
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Public can only read active showcases
CREATE POLICY "Public can view active platform showcases"
ON public.platform_showcases
FOR SELECT
USING (is_active = true);

-- 2. FIX CUSTOMERS TABLE - Make user_id NOT NULL
-- =====================================================
-- First, delete any orphaned customer records without user_id
DELETE FROM public.customers WHERE user_id IS NULL;

-- Add NOT NULL constraint
ALTER TABLE public.customers 
ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to prevent duplicate customer records per user
ALTER TABLE public.customers 
DROP CONSTRAINT IF EXISTS customers_user_id_key;

ALTER TABLE public.customers 
ADD CONSTRAINT customers_user_id_key UNIQUE (user_id);

-- 3. CREATE USER_ROLES TABLE FOR PROPER ROLE MANAGEMENT
-- =====================================================
-- Create role enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manufacturer', 'hospital', 'investor');
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Migrate existing roles from profiles to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
  AND role IN ('admin', 'manufacturer', 'hospital', 'investor')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. FIX FUNCTION SEARCH_PATH - Update all functions with mutable search_path
-- =====================================================

-- Fix mark_overdue_maintenance
CREATE OR REPLACE FUNCTION public.mark_overdue_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.maintenance 
  SET is_overdue = TRUE, updated_at = now()
  WHERE scheduled_date < now() 
    AND status NOT IN ('completed', 'cancelled')
    AND is_overdue = FALSE;
END;
$$;

-- Fix soft_delete_account
CREATE OR REPLACE FUNCTION public.soft_delete_account(target_user_id uuid, grace_period_days integer DEFAULT 7)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
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

-- Fix restore_deleted_account
CREATE OR REPLACE FUNCTION public.restore_deleted_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = target_user_id
    AND is_deleted = TRUE
    AND can_restore_until > now()
  ) THEN
    RETURN FALSE;
  END IF;
  
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

-- Fix create_or_update_customer_with_shipping
CREATE OR REPLACE FUNCTION public.create_or_update_customer_with_shipping(
  p_user_id uuid, 
  p_full_name text, 
  p_phone_number text, 
  p_email text, 
  p_street text, 
  p_city text, 
  p_country text, 
  p_zip_code text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  customer_uuid UUID;
  shipping_address_uuid UUID;
  full_address_text TEXT;
BEGIN
  full_address_text := p_street || ', ' || p_city || ', ' || p_country;
  IF p_zip_code IS NOT NULL AND p_zip_code != '' THEN
    full_address_text := full_address_text || ' ' || p_zip_code;
  END IF;

  INSERT INTO public.customers (user_id, full_name, phone_number, email)
  VALUES (p_user_id, p_full_name, p_phone_number, p_email)
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number,
    email = EXCLUDED.email,
    updated_at = now()
  RETURNING id INTO customer_uuid;

  IF customer_uuid IS NULL THEN
    SELECT id INTO customer_uuid FROM public.customers WHERE user_id = p_user_id;
  END IF;

  INSERT INTO public.shipping_addresses (
    customer_id, full_name, phone_number, street, city, country, zip_code, full_address, is_default
  ) VALUES (
    customer_uuid, p_full_name, p_phone_number, p_street, p_city, p_country, p_zip_code, full_address_text, true
  ) RETURNING id INTO shipping_address_uuid;

  UPDATE public.shipping_addresses 
  SET is_default = false 
  WHERE customer_id = customer_uuid AND id != shipping_address_uuid;

  RETURN shipping_address_uuid;
END;
$$;

-- Fix schedule_maintenance_notifications
CREATE OR REPLACE FUNCTION public.schedule_maintenance_notifications(maintenance_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  maintenance_record RECORD;
  reminder_date TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT * INTO maintenance_record 
  FROM public.maintenance 
  WHERE id = maintenance_id_param;
  
  IF maintenance_record IS NULL THEN
    RETURN;
  END IF;
  
  reminder_date := maintenance_record.scheduled_date - INTERVAL '24 hours';
  
  INSERT INTO public.maintenance_notifications (
    maintenance_id,
    notification_type,
    scheduled_for,
    message,
    recipient_id
  ) VALUES (
    maintenance_id_param,
    'reminder',
    reminder_date,
    'Maintenance scheduled for ' || maintenance_record.equipment_id || ' tomorrow',
    maintenance_record.created_by
  );
  
  INSERT INTO public.maintenance_notifications (
    maintenance_id,
    notification_type,
    scheduled_for,
    message,
    recipient_id
  ) VALUES (
    maintenance_id_param,
    'overdue',
    maintenance_record.scheduled_date + INTERVAL '1 hour',
    'Maintenance for ' || maintenance_record.equipment_id || ' is overdue',
    maintenance_record.created_by
  );
END;
$$;

-- Fix trigger_schedule_maintenance_notifications
CREATE OR REPLACE FUNCTION public.trigger_schedule_maintenance_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'scheduled' THEN
    PERFORM public.schedule_maintenance_notifications(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix log_audit_event
CREATE OR REPLACE FUNCTION public.log_audit_event(
  action_param text, 
  resource_type_param text, 
  resource_id_param text DEFAULT NULL::text, 
  old_values_param jsonb DEFAULT NULL::jsonb, 
  new_values_param jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    action_param,
    resource_type_param,
    resource_id_param,
    old_values_param,
    new_values_param
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Fix send_system_message
CREATE OR REPLACE FUNCTION public.send_system_message(
  recipient_id_param uuid, 
  recipient_role_param text, 
  subject_param text, 
  content_param text, 
  message_type_param text DEFAULT 'direct'::text, 
  priority_param text DEFAULT 'normal'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  message_id UUID;
BEGIN
  INSERT INTO public.system_messages (
    sender_id,
    recipient_id,
    recipient_role,
    subject,
    content,
    message_type,
    priority
  ) VALUES (
    auth.uid(),
    recipient_id_param,
    recipient_role_param,
    subject_param,
    content_param,
    message_type_param,
    priority_param
  ) RETURNING id INTO message_id;
  
  PERFORM public.log_audit_event(
    'SEND_MESSAGE',
    'system_message',
    message_id::TEXT
  );
  
  RETURN message_id;
END;
$$;

-- Fix create_data_backup
CREATE OR REPLACE FUNCTION public.create_data_backup(name_param text, backup_type_param text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  backup_id UUID;
BEGIN
  INSERT INTO public.data_backups (
    name,
    backup_type,
    created_by,
    status
  ) VALUES (
    name_param,
    backup_type_param,
    auth.uid(),
    'in_progress'
  ) RETURNING id INTO backup_id;
  
  PERFORM public.log_audit_event(
    'CREATE_BACKUP',
    'data_backup',
    backup_id::TEXT
  );
  
  RETURN backup_id;
END;
$$;

-- Fix archive_old_data
CREATE OR REPLACE FUNCTION public.archive_old_data(
  table_name_param text, 
  cutoff_date timestamp with time zone, 
  reason_param text DEFAULT 'Automated archival'::text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  archived_count INTEGER := 0;
BEGIN
  PERFORM public.log_audit_event(
    'ARCHIVE_DATA',
    table_name_param,
    cutoff_date::TEXT
  );
  
  RETURN archived_count;
END;
$$;

-- Fix update_equipment_popularity_score
CREATE OR REPLACE FUNCTION public.update_equipment_popularity_score(equipment_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  booking_count_val INTEGER;
  usage_hours_val INTEGER;
  calculated_score INTEGER;
BEGIN
  SELECT COUNT(*) INTO booking_count_val
  FROM public.bookings 
  WHERE equipment_id = equipment_id_param AND status != 'cancelled';
  
  SELECT COALESCE(usage_hours, 0) INTO usage_hours_val
  FROM public.equipment 
  WHERE id = equipment_id_param;
  
  calculated_score := (booking_count_val * 10) + usage_hours_val;
  
  UPDATE public.equipment 
  SET 
    popularity_score = calculated_score,
    booking_count = booking_count_val,
    last_popularity_update = NOW()
  WHERE id = equipment_id_param;
END;
$$;

-- Fix get_top_popular_equipment
CREATE OR REPLACE FUNCTION public.get_top_popular_equipment(limit_count integer DEFAULT 5)
RETURNS TABLE(
  id uuid, 
  name text, 
  manufacturer text, 
  category text, 
  status text, 
  location text, 
  image_url text, 
  popularity_score integer, 
  is_featured boolean, 
  booking_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.manufacturer,
    e.category,
    e.status,
    e.location,
    e.image_url,
    e.popularity_score,
    e.is_featured,
    e.booking_count
  FROM public.equipment e
  WHERE e.status = 'Available'
  ORDER BY 
    e.is_featured DESC,
    e.popularity_score DESC,
    e.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Fix trigger_update_equipment_popularity
CREATE OR REPLACE FUNCTION public.trigger_update_equipment_popularity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_equipment_popularity_score(NEW.equipment_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.update_equipment_popularity_score(OLD.equipment_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Fix permanent_delete_account
CREATE OR REPLACE FUNCTION public.permanent_delete_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
  
  SELECT role INTO target_role FROM public.profiles WHERE id = target_user_id;
  SELECT role INTO current_user_role FROM public.profiles WHERE id = current_user_id;
  
  IF current_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;
  
  IF target_role = 'admin' AND current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Insufficient permissions to delete admin account';
  END IF;
  
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
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Fix log_admin_action
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param text, 
  target_user_id_param uuid, 
  details_param jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  action_id UUID;
  target_email TEXT;
  target_name TEXT;
BEGIN
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

-- Fix create_email_verification
CREATE OR REPLACE FUNCTION public.create_email_verification(
  user_email text, 
  token_hash_param text, 
  ip_address_param inet DEFAULT NULL::inet, 
  user_agent_param text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  verification_id uuid;
  user_record record;
BEGIN
  SELECT id INTO user_record FROM auth.users WHERE email = user_email;
  
  IF user_record IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  INSERT INTO public.email_verification_log (
    user_id,
    email,
    token_hash,
    expires_at,
    ip_address,
    user_agent
  ) VALUES (
    user_record.id,
    user_email,
    token_hash_param,
    now() + interval '24 hours',
    ip_address_param,
    user_agent_param
  ) RETURNING id INTO verification_id;
  
  UPDATE public.profiles 
  SET 
    verification_token_sent_at = now(),
    verification_attempts = COALESCE(verification_attempts, 0) + 1
  WHERE id = user_record.id;
  
  RETURN verification_id;
END;
$$;

-- Fix verify_email_token
CREATE OR REPLACE FUNCTION public.verify_email_token(token_hash_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  verification_record record;
BEGIN
  SELECT * INTO verification_record 
  FROM public.email_verification_log 
  WHERE token_hash = token_hash_param 
    AND verified_at IS NULL 
    AND expires_at > now()
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF verification_record IS NULL THEN
    RETURN false;
  END IF;
  
  UPDATE public.email_verification_log 
  SET verified_at = now() 
  WHERE id = verification_record.id;
  
  UPDATE public.profiles 
  SET email_verified_at = now() 
  WHERE id = verification_record.user_id;
  
  UPDATE auth.users 
  SET email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE id = verification_record.user_id;
  
  RETURN true;
END;
$$;

-- Fix is_email_verified
CREATE OR REPLACE FUNCTION public.is_email_verified(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_verified boolean := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = user_email 
      AND (p.email_verified_at IS NOT NULL OR u.email_confirmed_at IS NOT NULL)
  ) INTO is_verified;
  
  RETURN is_verified;
END;
$$;

-- Fix check_auth_rate_limit
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  attempt_count integer;
  time_window interval := '15 minutes';
  max_attempts integer := 5;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM auth.audit_log_entries
  WHERE payload->>'email' = user_email
    AND payload->>'action' = 'login'
    AND payload->>'result' = 'failure'
    AND created_at > now() - time_window;
  
  RETURN attempt_count < max_attempts;
END;
$$;

-- Fix validate_email
CREATE OR REPLACE FUNCTION public.validate_email(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Fix log_security_event
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type_param text, 
  event_details_param jsonb DEFAULT '{}'::jsonb, 
  ip_address_param inet DEFAULT NULL::inet, 
  user_agent_param text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    event_type_param,
    event_details_param,
    ip_address_param,
    user_agent_param
  );
END;
$$;

-- Fix update_user_last_active
CREATE OR REPLACE FUNCTION public.update_user_last_active(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET last_active = now() 
  WHERE id = user_uuid;
END;
$$;

-- Fix create_order
CREATE OR REPLACE FUNCTION public.create_order(order_data jsonb)
RETURNS SETOF orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.orders(
    equipment_id,
    user_id,
    amount,
    payment_method,
    shipping_address,
    notes,
    status
  )
  VALUES (
    (order_data->>'equipment_id')::UUID,
    (order_data->>'user_id')::UUID,
    (order_data->>'amount')::NUMERIC,
    order_data->>'payment_method',
    order_data->>'shipping_address',
    order_data->>'notes',
    COALESCE(order_data->>'status', 'pending')
  )
  RETURNING *;
END;
$$;