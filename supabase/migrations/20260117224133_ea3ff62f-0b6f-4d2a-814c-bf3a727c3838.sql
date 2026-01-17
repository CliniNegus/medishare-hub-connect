-- Create manufacturer_onboarding table for storing onboarding wizard data
CREATE TABLE public.manufacturer_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  country TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  product_categories TEXT[],
  shop_name TEXT,
  shop_description TEXT,
  shop_logo_url TEXT,
  catalog_file_url TEXT,
  business_model TEXT CHECK (business_model IN ('consignment', 'pay_per_use', 'direct_purchase')),
  credit_limit NUMERIC,
  payment_cycle INTEGER CHECK (payment_cycle IN (30, 60, 90)),
  returns_policy TEXT,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.manufacturer_onboarding ENABLE ROW LEVEL SECURITY;

-- Users can view their own onboarding data
CREATE POLICY "Users can view own onboarding"
  ON public.manufacturer_onboarding FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own onboarding data
CREATE POLICY "Users can insert own onboarding"
  ON public.manufacturer_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own onboarding data
CREATE POLICY "Users can update own onboarding"
  ON public.manufacturer_onboarding FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all onboarding data
CREATE POLICY "Admins can view all onboarding"
  ON public.manufacturer_onboarding FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update onboarding status
CREATE POLICY "Admins can update onboarding"
  ON public.manufacturer_onboarding FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_manufacturer_onboarding_updated_at
  BEFORE UPDATE ON public.manufacturer_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();