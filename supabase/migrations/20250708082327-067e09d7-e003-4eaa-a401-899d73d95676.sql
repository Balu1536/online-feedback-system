-- Update the admin password to use the correct hash for 'admin123'
UPDATE public.admins 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'balasubramanyam200517@gmail.com';