-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  faculty_id TEXT NOT NULL REFERENCES public.faculty(faculty_id),
  subject_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  
  -- Rating categories (1-10 scale)
  teaching_effectiveness INTEGER CHECK (teaching_effectiveness >= 1 AND teaching_effectiveness <= 10),
  course_content INTEGER CHECK (course_content >= 1 AND course_content <= 10),
  communication_skills INTEGER CHECK (communication_skills >= 1 AND communication_skills <= 10),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality >= 1 AND punctuality <= 10),
  student_interaction INTEGER CHECK (student_interaction >= 1 AND student_interaction <= 10),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
  
  -- Text feedback
  positive_feedback TEXT,
  suggestions_for_improvement TEXT,
  additional_comments TEXT,
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_anonymous BOOLEAN DEFAULT true,
  
  UNIQUE(student_id, faculty_id, subject_name, semester, academic_year)
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback
CREATE POLICY "Students can view their own feedback" 
ON public.feedback 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own feedback" 
ON public.feedback 
FOR UPDATE 
USING (auth.uid() = student_id);

-- Create admin table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Insert the admin user with provided credentials
INSERT INTO public.admins (email, password_hash, name) 
VALUES ('balasubramanyam200517@gmail.com', crypt('15082005', gen_salt('bf')), 'Admin Balasubramanyam');

-- Create admin verification function
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_email text, p_password text)
RETURNS TABLE(is_valid boolean, admin_data json)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (a.password_hash = crypt(p_password, a.password_hash)) as is_valid,
    CASE 
      WHEN a.password_hash = crypt(p_password, a.password_hash) THEN
        row_to_json(a.*)
      ELSE
        NULL::JSON
    END as admin_data
  FROM public.admins a
  WHERE a.email = p_email;
    
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE as is_valid, NULL::JSON as admin_data;
  END IF;
END;
$$;

-- Create function to get feedback analytics
CREATE OR REPLACE FUNCTION public.get_feedback_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_feedback_count', (SELECT COUNT(*) FROM public.feedback),
    'average_overall_rating', (SELECT ROUND(AVG(overall_rating), 2) FROM public.feedback),
    'faculty_ratings', (
      SELECT json_agg(
        json_build_object(
          'faculty_id', f.faculty_id,
          'faculty_name', f.name,
          'avg_rating', ROUND(AVG(fb.overall_rating), 2),
          'feedback_count', COUNT(fb.id)
        )
      )
      FROM public.faculty f
      LEFT JOIN public.feedback fb ON f.faculty_id = fb.faculty_id
      GROUP BY f.faculty_id, f.name
      ORDER BY AVG(fb.overall_rating) DESC NULLS LAST
    ),
    'rating_distribution', (
      SELECT json_agg(
        json_build_object(
          'rating', rating,
          'count', count
        )
      )
      FROM (
        SELECT overall_rating as rating, COUNT(*) as count
        FROM public.feedback
        GROUP BY overall_rating
        ORDER BY overall_rating
      ) rd
    ),
    'monthly_trends', (
      SELECT json_agg(
        json_build_object(
          'month', month,
          'year', year,
          'count', count,
          'avg_rating', avg_rating
        )
      )
      FROM (
        SELECT 
          EXTRACT(MONTH FROM submitted_at) as month,
          EXTRACT(YEAR FROM submitted_at) as year,
          COUNT(*) as count,
          ROUND(AVG(overall_rating), 2) as avg_rating
        FROM public.feedback
        GROUP BY EXTRACT(YEAR FROM submitted_at), EXTRACT(MONTH FROM submitted_at)
        ORDER BY year DESC, month DESC
        LIMIT 12
      ) mt
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create some sample feedback data for testing
INSERT INTO public.feedback (
  student_id, faculty_id, subject_name, semester, academic_year,
  teaching_effectiveness, course_content, communication_skills, punctuality, student_interaction, overall_rating,
  positive_feedback, suggestions_for_improvement
) VALUES 
-- Sample data for Dr. V. Lokeswara Reddy
(gen_random_uuid(), '1060406', 'Data Structures', 'III', '2024-25', 9, 8, 9, 10, 8, 9, 'Excellent teaching methodology and clear explanations', 'More practical examples would be helpful'),
(gen_random_uuid(), '1060406', 'Data Structures', 'III', '2024-25', 8, 9, 8, 9, 9, 9, 'Very knowledgeable professor', 'Could provide more assignments'),
-- Sample data for Dr. K. Srinivasa Rao  
(gen_random_uuid(), '1060402', 'Database Management', 'IV', '2024-25', 9, 9, 8, 9, 8, 9, 'Great depth of knowledge', 'More lab sessions needed'),
(gen_random_uuid(), '1060402', 'Database Management', 'IV', '2024-25', 8, 8, 9, 8, 9, 8, 'Good practical approach', 'Faster response to queries'),
-- Sample data for other faculty
(gen_random_uuid(), '1062401', 'Software Engineering', 'V', '2024-25', 8, 8, 9, 8, 9, 8, 'Industry experience shows in teaching', 'More case studies'),
(gen_random_uuid(), '1062101', 'Computer Networks', 'VI', '2024-25', 7, 8, 8, 9, 7, 8, 'Good theoretical foundation', 'More hands-on labs'),
(gen_random_uuid(), '1062001', 'Operating Systems', 'V', '2024-25', 9, 8, 8, 9, 8, 8, 'Excellent problem-solving approach', 'More interactive sessions'),
(gen_random_uuid(), '1060508', 'Machine Learning', 'VII', '2024-25', 9, 9, 8, 8, 9, 9, 'Very clear explanations of complex topics', 'More real-world projects'),
(gen_random_uuid(), '1060811', 'Web Technologies', 'VI', '2024-25', 8, 9, 9, 8, 8, 8, 'Good practical knowledge', 'More framework coverage'),
(gen_random_uuid(), '1060805', 'Artificial Intelligence', 'VIII', '2024-25', 9, 9, 9, 9, 8, 9, 'Outstanding teaching and research guidance', 'More research opportunities');