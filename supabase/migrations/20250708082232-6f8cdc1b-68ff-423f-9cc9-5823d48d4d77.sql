-- Drop and recreate the verify_admin_credentials function with proper search_path
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_email text, p_password text)
RETURNS TABLE(is_valid boolean, admin_data json)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set search_path to include the extensions schema
  SET search_path = public, extensions;
  
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