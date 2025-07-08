-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id)
);

-- Create course_assignments table to map faculty to courses and sections
CREATE TABLE public.course_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(course_id),
  faculty_id TEXT NOT NULL REFERENCES public.faculty(faculty_id),
  section TEXT NOT NULL,
  semester TEXT NOT NULL DEFAULT '3rd',
  academic_year TEXT NOT NULL DEFAULT '2024-25',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, faculty_id, section, semester, academic_year)
);

-- Enable RLS on both tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for courses table
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- Create policies for course_assignments table
CREATE POLICY "Course assignments are viewable by everyone" 
ON public.course_assignments 
FOR SELECT 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_assignments_updated_at
BEFORE UPDATE ON public.course_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert courses data
INSERT INTO public.courses (course_id, course_name) VALUES
('23HS421', 'Managerial Economics & Financial Analysis'),
('23HS402', 'Probability and Statistics'),
('2305401', 'Operating Systems'),
('2339402', 'Database Management Systems'),
('2305402', 'Software Engineering'),
('2305451', 'Operating Systems Lab'),
('2339452', 'Database Management Systems Lab'),
('2305452', 'Full Stack Development – 1'),
('2304453', 'Design Thinking and Innovation'),
('CCT001', 'Cambridge Communication Training'),
('PPL001', 'Programming Practice Lab')
ON CONFLICT (course_id) DO NOTHING;

-- Insert course assignments for Section A
INSERT INTO public.course_assignments (course_id, faculty_id, section, semester, academic_year) VALUES
('2305401', '1061901', 'A', '3rd', '2024-25'),
('2339402', '1060811', 'A', '3rd', '2024-25'),
('2305451', '1061901', 'A', '3rd', '2024-25'),
('2305451', '1061907', 'A', '3rd', '2024-25'),
('2305452', '1061202', 'A', '3rd', '2024-25'),
('2304453', '1062402', 'A', '3rd', '2024-25')
ON CONFLICT DO NOTHING;

-- Insert course assignments for Section B
INSERT INTO public.course_assignments (course_id, faculty_id, section, semester, academic_year) VALUES
('2305401', '1060402', 'B', '3rd', '2024-25'),
('2339402', '1061907', 'B', '3rd', '2024-25'),
('2305402', '1061908', 'B', '3rd', '2024-25'),
('2305451', '1060402', 'B', '3rd', '2024-25'),
('2305451', '1061001', 'B', '3rd', '2024-25'),
('2339452', '1061907', 'B', '3rd', '2024-25'),
('2305452', '1061202', 'B', '3rd', '2024-25'),
('2305452', '1062102', 'B', '3rd', '2024-25'),
('2304453', '1062303', 'B', '3rd', '2024-25'),
('PPL001', '1062203', 'B', '3rd', '2024-25')
ON CONFLICT DO NOTHING;

-- Insert course assignments for Section C
INSERT INTO public.course_assignments (course_id, faculty_id, section, semester, academic_year) VALUES
('2305401', '1061901', 'C', '3rd', '2024-25'),
('2305402', '1062101', 'C', '3rd', '2024-25'),
('2305451', '1061901', 'C', '3rd', '2024-25'),
('2305451', '1061202', 'C', '3rd', '2024-25'),
('2339452', '1072201', 'C', '3rd', '2024-25'),
('2305452', '1062402', 'C', '3rd', '2024-25'),
('2305452', '1061908', 'C', '3rd', '2024-25'),
('2304453', '1061901', 'C', '3rd', '2024-25'),
('PPL001', '1062001', 'C', '3rd', '2024-25')
ON CONFLICT DO NOTHING;