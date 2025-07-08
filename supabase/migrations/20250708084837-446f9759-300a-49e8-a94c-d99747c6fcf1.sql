-- Insert feedback records for Sri. P. Suresh Yadav with 9/10 rating
INSERT INTO public.feedback (
  faculty_id,
  student_id,
  subject_name,
  academic_year,
  semester,
  teaching_effectiveness,
  course_content,
  communication_skills,
  punctuality,
  student_interaction,
  overall_rating,
  positive_feedback,
  suggestions_for_improvement,
  is_anonymous
) VALUES 
  ('1062203', gen_random_uuid(), 'Computer Networks', '2024-25', '3rd', 9, 9, 9, 9, 9, 9, 'Excellent teaching methodology and clear explanations', 'Continue the same approach', true),
  ('1062203', gen_random_uuid(), 'Database Management', '2024-25', '3rd', 9, 9, 8, 9, 9, 9, 'Very good practical approach to teaching', 'More real-world examples would be helpful', true),
  ('1062203', gen_random_uuid(), 'Software Engineering', '2024-25', '3rd', 9, 9, 9, 8, 9, 9, 'Great interaction with students', 'Keep up the excellent work', true);