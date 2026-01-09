-- Allow users to insert their own role (for onboarding)
CREATE POLICY "Users can insert their own role during onboarding"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);