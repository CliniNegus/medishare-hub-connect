
-- Create a security definer function to check if the current user is an admin
-- This function runs with elevated privileges and bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policies using the security definer function
CREATE POLICY "Allow admin access to all profiles" 
ON public.profiles 
FOR ALL
TO authenticated 
USING (public.is_admin() OR auth.uid() = id);

-- Simpler policy for general access - users can see their own profile, admins can see all
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile, admins can update any profile
CREATE POLICY "Users can update profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id OR public.is_admin());
