
-- Create table for User Multi-Factor Authentication
CREATE TABLE IF NOT EXISTS public.user_mfa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS policies for user_mfa table
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own MFA settings
CREATE POLICY "Users can view their own MFA settings" 
  ON public.user_mfa 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to update only their own MFA settings
CREATE POLICY "Users can update their own MFA settings" 
  ON public.user_mfa 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own MFA settings
CREATE POLICY "Users can insert their own MFA settings" 
  ON public.user_mfa 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create table for API rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on reset_at for cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON public.rate_limits(reset_at);

-- Add function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE reset_at < extract(epoch from now());
END;
$$;

-- Add scheduled job to clean up rate limits
SELECT cron.schedule(
  'cleanup-rate-limits',
  '0 * * * *', -- Run every hour
  'SELECT cleanup_rate_limits();'
);

-- Allow authenticated users to manage their own rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the service role to manage rate limits
CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limits
  USING (true);
