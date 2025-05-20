
-- Add new columns to the profiles table for enhanced profile information
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Update the handle_new_user function to include these new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
    is_new_user
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
    TRUE
  );
  
  RETURN new;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile entry when a new user signs up';
