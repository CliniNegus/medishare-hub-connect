
-- Create system_settings table for storing global configurations
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admin users can select system settings
CREATE POLICY "Admin users can view system settings"
ON public.system_settings
FOR SELECT
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Only admin users can insert system settings
CREATE POLICY "Admin users can insert system settings"
ON public.system_settings
FOR INSERT
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Only admin users can update system settings
CREATE POLICY "Admin users can update system settings"
ON public.system_settings
FOR UPDATE
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Create trigger to update the updated_at column
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
