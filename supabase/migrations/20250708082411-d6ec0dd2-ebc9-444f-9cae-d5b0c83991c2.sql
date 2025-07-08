-- Create a more robust version of the function that explicitly references the crypt function
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_email text, p_password text)
RETURNS TABLE(is_valid boolean, admin_data json)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_record public.admins%ROWTYPE;
    password_matches boolean := false;
BEGIN
  -- Get the admin record
  SELECT * INTO admin_record 
  FROM public.admins 
  WHERE email = p_email;
  
  -- Check if admin exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE as is_valid, NULL::JSON as admin_data;
    RETURN;
  END IF;
  
  -- Verify password using the crypt function with explicit schema
  SELECT (admin_record.password_hash = extensions.crypt(p_password, admin_record.password_hash)) 
  INTO password_matches;
  
  -- Return result
  IF password_matches THEN
    RETURN QUERY SELECT TRUE as is_valid, row_to_json(admin_record.*) as admin_data;
  ELSE
    RETURN QUERY SELECT FALSE as is_valid, NULL::JSON as admin_data;
  END IF;
END;
$$;