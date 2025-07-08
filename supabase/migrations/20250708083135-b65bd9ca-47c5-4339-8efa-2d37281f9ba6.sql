-- Enable admin operations on faculty table
CREATE POLICY "Admins can update faculty" 
ON public.faculty 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
));

CREATE POLICY "Admins can delete faculty" 
ON public.faculty 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
));

CREATE POLICY "Admins can insert faculty" 
ON public.faculty 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
));