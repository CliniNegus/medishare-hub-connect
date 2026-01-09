-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own role during onboarding" ON public.user_roles;

-- Create a simpler policy that allows users to insert their own roles
-- The unique constraint (user_id, role) will prevent duplicates
CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);