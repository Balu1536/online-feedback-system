-- Allow admins to view all feedback (bypass RLS for admin queries)
CREATE POLICY "Admins can view all feedback" 
ON public.feedback 
FOR SELECT 
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Allow admins to insert feedback (for testing purposes)
CREATE POLICY "Admins can insert feedback" 
ON public.feedback 
FOR INSERT 
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Allow admins to update feedback
CREATE POLICY "Admins can update feedback" 
ON public.feedback 
FOR UPDATE 
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Allow admins to delete feedback
CREATE POLICY "Admins can delete feedback" 
ON public.feedback 
FOR DELETE 
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);