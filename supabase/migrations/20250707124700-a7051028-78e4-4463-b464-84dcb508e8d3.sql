-- Create faculty table
CREATE TABLE public.faculty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty access
CREATE POLICY "Faculty table is viewable by everyone" 
ON public.faculty 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_faculty_updated_at
BEFORE UPDATE ON public.faculty
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert faculty data
INSERT INTO public.faculty (faculty_id, name, designation, qualification, experience) VALUES 
('1060406', 'Dr. V. Lokeswara Reddy', 'Professor & HoD', 'M.Tech., Ph.D.', '22 Years'),
('1060402', 'Dr. K. Srinivasa Rao', 'Professor', 'M.Tech., Ph.D.', '23 Years'),
('1062401', 'Sri. Nagaraju Rayapati', 'Associate Professor', 'B.Tech., MS (USA)', '14 Years'),
('1062101', 'Sri A. Ramprakash Reddy', 'Assistant Professor', 'M.Tech., (Ph.D)', '10 Years'),
('1062001', 'Sri. MD. Rahmathulla', 'Assistant Professor', 'M.Tech.', '26 Years'),
('1060508', 'Smt. B. Manorama Devi', 'Assistant Professor', 'M.Tech., (Ph.D)', '16 Years'),
('1060811', 'Sri. Y. Prasad Reddy', 'Assistant Professor', 'M.Tech.', '15 Years'),
('1060805', 'Sri. S. Khaja Khizar', 'Assistant Professor', 'M.Tech., (Ph.D)', '15 Years'),
('1061001', 'Smt. V. Sudha', 'Assistant Professor', 'M.Tech., (Ph.D)', '13 Years'),
('1061202', 'Smt. B. Swetha', 'Assistant Professor', 'M.Tech., (Ph.D)', '12 Years'),
('1072201', 'Smt. O. Divya', 'Assistant Professor', 'M.Tech.', '6 Years'),
('1072202', 'Sri. D. Priyadarshan Reddy', 'Assistant Professor', 'M.Tech.', '4 Years'),
('1061806', 'Smt. P. Naga Lakshmi', 'Assistant Professor', 'M.Tech.', '2 Years'),
('1062301', 'Sri. M. Suresh Babu', 'Assistant Professor', 'M.Tech.', '8 Years'),
('1061901', 'Miss. Z. Shobha Rani', 'Assistant Professor', 'M.Tech., (Ph.D)', '11 Years'),
('1061907', 'Miss. T. Anitha', 'Assistant Professor', 'M.Tech.', '4 Years'),
('1061908', 'Smt. O.V. Sowmya', 'Assistant Professor', 'M.Tech., (Ph.D)', '6 Years'),
('1062102', 'Sri B. Mahesh Reddy', 'Assistant Professor', 'M.Tech.', '6 Years'),
('1062109', 'Smt. K. Shabana', 'Assistant Professor', 'M.Tech.', '7 Years'),
('1062201', 'Smt. K. Sujana Kumari', 'Assistant Professor', 'M.Tech.', '5 Years'),
('1062110', 'Smt. Priyanka Ankireddy', 'Assistant Professor', 'M.Tech.', '2 Years'),
('1062203', 'Sri. P. Suresh Yadav', 'Assistant Professor', 'M.Tech.', '8 Years'),
('1062303', 'Sri. T. Muneiah', 'Assistant Professor', 'M.Tech.', '1 Year'),
('1062402', 'Sri. N. Narayana Reddy', 'Assistant Professor', 'M.Tech.', '14 Years');