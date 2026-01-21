-- Add commercial terms columns to manufacturer_onboarding table
ALTER TABLE public.manufacturer_onboarding 
ADD COLUMN IF NOT EXISTS usage_policy text,
ADD COLUMN IF NOT EXISTS maintenance_responsibility text,
ADD COLUMN IF NOT EXISTS billing_basis text DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS direct_payment_terms text;