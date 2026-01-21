-- Add business_models array column (for multiple selections)
ALTER TABLE public.manufacturer_onboarding 
ADD COLUMN IF NOT EXISTS business_models text[] DEFAULT '{}';

-- Migrate existing data from business_model to business_models array
UPDATE public.manufacturer_onboarding 
SET business_models = ARRAY[business_model]
WHERE business_model IS NOT NULL AND business_model != '' AND (business_models IS NULL OR array_length(business_models, 1) IS NULL);

-- Add comment for documentation
COMMENT ON COLUMN public.manufacturer_onboarding.business_models IS 'Array of selected business models: consignment, pay_per_use, direct_purchase';