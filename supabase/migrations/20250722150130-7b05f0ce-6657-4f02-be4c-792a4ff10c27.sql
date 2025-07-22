-- Add profile completion tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_completion_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS profile_draft JSONB DEFAULT '{}';

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    organization,
    bio,
    location,
    phone,
    website,
    is_new_user,
    profile_completed,
    profile_completion_step,
    profile_draft
  )
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'hospital'), 
    new.raw_user_meta_data->>'organization',
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'website',
    TRUE,
    FALSE,
    0,
    '{}'
  );
  
  RETURN new;
END;
$$;