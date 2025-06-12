
-- Create a table for platform showcase items
CREATE TABLE public.platform_showcases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to make data publicly readable
ALTER TABLE public.platform_showcases ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read showcase data (for public landing page)
CREATE POLICY "Platform showcases are publicly readable" 
  ON public.platform_showcases 
  FOR SELECT 
  USING (is_active = true);

-- Create policy that allows authenticated users to manage showcase data
CREATE POLICY "Authenticated users can manage platform showcases" 
  ON public.platform_showcases 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert the existing showcase data
INSERT INTO public.platform_showcases (title, description, image_url, alt_text, display_order) VALUES
('Hospital Dashboard', 'Manage inventory, track equipment usage, and handle equipment requests all in one place.', 'https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/hospital-dashboard.jpg', 'Hospital Dashboard Interface', 1),
('Manufacturer Dashboard', 'Monitor equipment distribution, manage virtual shops, and track real-time usage metrics.', 'https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/manufacturer-dashboard.jpg', 'Manufacturer Dashboard Interface', 2),
('Investor Dashboard', 'Track investments, monitor ROI, and discover new opportunities in the medical equipment space.', 'https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/investor-dashboard.jpg', 'Investor Dashboard Interface', 3);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION public.update_platform_showcases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_showcases_updated_at
  BEFORE UPDATE ON public.platform_showcases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_platform_showcases_updated_at();
