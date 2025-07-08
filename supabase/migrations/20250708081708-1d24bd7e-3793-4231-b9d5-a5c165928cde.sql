-- Temporarily allow anyone to insert feedback for testing
-- This makes it easier to test the feedback submission without complex auth setup
ALTER POLICY "Students can insert their own feedback" ON public.feedback 
RENAME TO "Students can insert their own feedback (old)";

CREATE POLICY "Allow feedback submission" 
ON public.feedback 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also allow anyone to view feedback for admin dashboard testing
CREATE POLICY "Allow feedback viewing for dashboard" 
ON public.feedback 
FOR SELECT 
TO public
USING (true);