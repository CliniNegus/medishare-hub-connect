-- Create account type change requests table
CREATE TABLE public.account_type_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL,
  to_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_feedback TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_type_change_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own requests"
ON public.account_type_change_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can create their own requests"
ON public.account_type_change_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.account_type_change_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update requests"
ON public.account_type_change_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_account_type_change_requests_updated_at
BEFORE UPDATE ON public.account_type_change_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has pending request
CREATE OR REPLACE FUNCTION public.has_pending_account_type_request(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_type_change_requests
    WHERE user_id = user_uuid
      AND status = 'pending'
  )
$$;

-- Function to approve account type change
CREATE OR REPLACE FUNCTION public.approve_account_type_change(request_id UUID, admin_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Get the request
  SELECT * INTO request_record
  FROM public.account_type_change_requests
  WHERE id = request_id AND status = 'pending';
  
  IF request_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update request status
  UPDATE public.account_type_change_requests
  SET 
    status = 'approved',
    reviewed_by = admin_user_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = request_id;
  
  -- Update user's profile role
  UPDATE public.profiles
  SET role = request_record.to_role, updated_at = now()
  WHERE id = request_record.user_id;
  
  -- Update user_roles table - remove old role and add new one
  DELETE FROM public.user_roles 
  WHERE user_id = request_record.user_id 
    AND role = request_record.from_role::app_role;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (request_record.user_id, request_record.to_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create notification for user
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (
    request_record.user_id,
    'Account Type Change Approved',
    'Your request to change account type to ' || request_record.to_role || ' has been approved.',
    'success',
    '/dashboard'
  );
  
  RETURN TRUE;
END;
$$;

-- Function to reject account type change
CREATE OR REPLACE FUNCTION public.reject_account_type_change(request_id UUID, admin_user_id UUID, feedback TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Get the request
  SELECT * INTO request_record
  FROM public.account_type_change_requests
  WHERE id = request_id AND status = 'pending';
  
  IF request_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update request status
  UPDATE public.account_type_change_requests
  SET 
    status = 'rejected',
    reviewed_by = admin_user_id,
    reviewed_at = now(),
    admin_feedback = feedback,
    updated_at = now()
  WHERE id = request_id;
  
  -- Create notification for user
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (
    request_record.user_id,
    'Account Type Change Rejected',
    'Your request to change account type to ' || request_record.to_role || ' has been rejected. Reason: ' || COALESCE(feedback, 'No reason provided'),
    'warning',
    '/profile'
  );
  
  RETURN TRUE;
END;
$$;