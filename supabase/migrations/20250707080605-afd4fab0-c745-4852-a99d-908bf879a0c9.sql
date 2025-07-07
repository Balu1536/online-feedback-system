-- Create profiles table for student information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  roll_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT,
  date_of_birth DATE NOT NULL,
  section TEXT,
  ssc_cgpa TEXT,
  inter_cgpa TEXT,
  aadhar_card TEXT,
  pan_card TEXT,
  mobile_primary TEXT,
  mobile_secondary TEXT,
  mobile_parents TEXT,
  personal_email TEXT,
  college_email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample student data
INSERT INTO public.profiles (
  roll_number, name, gender, date_of_birth, ssc_cgpa, inter_cgpa, 
  aadhar_card, pan_card, mobile_primary, mobile_secondary, mobile_parents, 
  personal_email, college_email, section, user_id
) VALUES 
  ('229Y1A0557', 'KANDULA JAYA KRISHNA REDDY', 'MALE', '2004-06-07', '10', '8.8', '214431739417', '', '7013198293', '8179886383', '7780458803', 'kandulajayakrishnaredy1234@gmail.com', '229Y1A0557@ksrmce.ac.in', 'A', '00000000-0000-0000-0000-000000000001'),
  ('239Y1A0501', 'ABBILI UDAY KUMAR', 'MALE', '2005-04-11', '9.5', '75', '309874197249', '', '7893093993', '7893093993', '9121133942', '', '239Y1A0501@ksrmce.ac.in', 'A', '00000000-0000-0000-0000-000000000002'),
  ('239Y1A0502', 'ADAVI PAVAN KUMAR', 'MALE', '2003-08-29', '10', '7.9', '756186882504', 'not available', '8309011301', '8309011301', '9381016114', 'adavipavan3@gmail.com', '239Y1A0502@ksrmce.ac.in', 'A', '00000000-0000-0000-0000-000000000003'),
  ('239Y1A0503', 'ADIBOYINA DHARITHRI', 'Female', '2006-01-25', '10', '8.3', '412410304744', 'GBOPD0861F', '9398713468', '9398713468', '9398352880', 'chinnidhana7100@gmail.com', '239Y1A0503@ksrmce.ac.in', 'A', '00000000-0000-0000-0000-000000000004'),
  ('239Y1A0504', 'AJJAGOTTU AJAY KUMAR REDDY', 'Male', '2005-07-16', '10', '9.5', '670298487610', 'Not available', '9381489569', '', '9502195290', 'ajaykumarreddy112233@gmail.com', '239Y1A0504@ksrmce.ac.in', 'A', '00000000-0000-0000-0000-000000000005');

-- Create function to verify student credentials
CREATE OR REPLACE FUNCTION public.verify_student_credentials(
  p_college_email TEXT,
  p_date_of_birth DATE DEFAULT NULL,
  p_roll_number TEXT DEFAULT NULL
)
RETURNS TABLE(
  is_valid BOOLEAN,
  student_data JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    row_to_json(p.*) as student_data
  FROM public.profiles p
  WHERE p.college_email = p_college_email
    AND (
      (p_date_of_birth IS NOT NULL AND p.date_of_birth = p_date_of_birth) OR
      (p_roll_number IS NOT NULL AND p.roll_number = p_roll_number)
    );
    
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE as is_valid, NULL::JSON as student_data;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;