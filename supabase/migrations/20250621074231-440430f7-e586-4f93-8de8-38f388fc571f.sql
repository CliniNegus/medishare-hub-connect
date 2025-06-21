
-- Create system_settings table to store application configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies - only admins can manage system settings
CREATE POLICY "Only admins can view system settings" 
  ON public.system_settings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert system settings" 
  ON public.system_settings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update system settings" 
  ON public.system_settings 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description) VALUES 
('system_name', '"CliniBuilds Dashboard"', 'platform', 'Application name'),
('default_currency', '"KES"', 'platform', 'Default currency for the system'),
('maintenance_mode', 'false', 'platform', 'System maintenance mode flag'),
('email_notifications', 'true', 'notification', 'Enable email notifications'),
('notification_frequency', '"realtime"', 'notification', 'Notification delivery frequency'),
('notify_orders', 'true', 'notification', 'Send order update notifications'),
('notify_maintenance', 'true', 'notification', 'Send maintenance alert notifications'),
('notify_system', 'true', 'notification', 'Send system notifications');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at();
