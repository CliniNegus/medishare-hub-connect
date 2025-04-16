
-- Function to create an admin user
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  full_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create the user in auth.users
  INSERT INTO auth.users (
    email,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin,
    email_confirmed_at
  ) VALUES (
    admin_email,
    jsonb_build_object('full_name', full_name, 'role', 'admin'),
    now(),
    now(),
    TRUE,
    now() -- Auto-confirm email for admin users
  )
  RETURNING id INTO new_user_id;
  
  -- Set the user's password
  UPDATE auth.users
  SET encrypted_password = crypt(admin_password, gen_salt('bf'))
  WHERE id = new_user_id;
  
  -- Ensure a profile record is created with admin role
  INSERT INTO public.profiles (id, email, full_name, role, organization, updated_at, created_at)
  VALUES (
    new_user_id, 
    admin_email, 
    full_name, 
    'admin', 
    'System Administration', 
    now(), 
    now()
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin',
      email = admin_email,
      full_name = EXCLUDED.full_name;

  -- Return the new user's ID
  RETURN new_user_id;
END;
$$;

-- Grant necessary permissions to use this function
GRANT EXECUTE ON FUNCTION public.create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO anon;
