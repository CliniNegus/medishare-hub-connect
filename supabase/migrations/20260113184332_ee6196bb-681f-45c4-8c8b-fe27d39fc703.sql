-- Create deletion_requests table
CREATE TABLE public.deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  account_type TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can view and manage deletion requests
CREATE POLICY "Admins can view all deletion requests"
ON public.deletion_requests
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update deletion requests"
ON public.deletion_requests
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete deletion requests"
ON public.deletion_requests
FOR DELETE
USING (is_admin());

-- Allow service role to insert (from edge function)
CREATE POLICY "Service role can insert deletion requests"
ON public.deletion_requests
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_deletion_requests_updated_at
BEFORE UPDATE ON public.deletion_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_deletion_requests_status ON public.deletion_requests(status);
CREATE INDEX idx_deletion_requests_email ON public.deletion_requests(email);
CREATE INDEX idx_deletion_requests_requested_at ON public.deletion_requests(requested_at DESC);