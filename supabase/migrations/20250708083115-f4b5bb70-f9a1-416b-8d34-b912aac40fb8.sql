-- Fix the get_feedback_analytics function to avoid nested aggregate functions
CREATE OR REPLACE FUNCTION public.get_feedback_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  faculty_ratings_data JSON;
  rating_dist_data JSON;
  monthly_trends_data JSON;
BEGIN
  -- Set search_path to prevent injection
  SET search_path = '';
  
  -- Get faculty ratings data
  WITH faculty_stats AS (
    SELECT 
      f.faculty_id,
      f.name as faculty_name,
      COALESCE(ROUND(AVG(fb.overall_rating), 2), 0) as avg_rating,
      COUNT(fb.id) as feedback_count
    FROM public.faculty f
    LEFT JOIN public.feedback fb ON f.faculty_id = fb.faculty_id
    GROUP BY f.faculty_id, f.name
  )
  SELECT json_agg(
    json_build_object(
      'faculty_id', faculty_id,
      'faculty_name', faculty_name,
      'avg_rating', avg_rating,
      'feedback_count', feedback_count
    )
    ORDER BY avg_rating DESC NULLS LAST
  ) INTO faculty_ratings_data
  FROM faculty_stats;
  
  -- Get rating distribution
  WITH rating_counts AS (
    SELECT 
      COALESCE(overall_rating, 0) as rating,
      COUNT(*) as count
    FROM public.feedback
    WHERE overall_rating IS NOT NULL
    GROUP BY overall_rating
  )
  SELECT json_agg(
    json_build_object(
      'rating', rating,
      'count', count
    )
    ORDER BY rating
  ) INTO rating_dist_data
  FROM rating_counts;
  
  -- Get monthly trends
  WITH monthly_stats AS (
    SELECT 
      EXTRACT(MONTH FROM submitted_at) as month,
      EXTRACT(YEAR FROM submitted_at) as year,
      COUNT(*) as count,
      COALESCE(ROUND(AVG(overall_rating), 2), 0) as avg_rating
    FROM public.feedback
    GROUP BY EXTRACT(YEAR FROM submitted_at), EXTRACT(MONTH FROM submitted_at)
    ORDER BY year DESC, month DESC
    LIMIT 12
  )
  SELECT json_agg(
    json_build_object(
      'month', month,
      'year', year,
      'count', count,
      'avg_rating', avg_rating
    )
  ) INTO monthly_trends_data
  FROM monthly_stats;
  
  -- Build final result
  SELECT json_build_object(
    'total_feedback_count', (SELECT COUNT(*) FROM public.feedback),
    'average_overall_rating', (
      SELECT COALESCE(ROUND(AVG(overall_rating), 2), 0) 
      FROM public.feedback 
      WHERE overall_rating IS NOT NULL
    ),
    'faculty_ratings', COALESCE(faculty_ratings_data, '[]'::json),
    'rating_distribution', COALESCE(rating_dist_data, '[]'::json),
    'monthly_trends', COALESCE(monthly_trends_data, '[]'::json)
  ) INTO result;
  
  RETURN result;
END;
$$;