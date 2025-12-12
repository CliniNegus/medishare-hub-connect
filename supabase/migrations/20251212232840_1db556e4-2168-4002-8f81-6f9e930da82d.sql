-- Add role-specific profile fields for comprehensive onboarding

-- Hospital-specific fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS equipment_needs TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS financing_needs TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hospital_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bed_capacity INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coordinates JSONB;

-- Manufacturer-specific fields  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS products_available TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_markets TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manufacturing_location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Investor-specific fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS investment_interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS investment_budget_range TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS investment_experience TEXT;

-- Add onboarding_completed flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;