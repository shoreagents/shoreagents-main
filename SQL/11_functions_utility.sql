-- Utility Functions
-- =================

-- DROP FUNCTION public.generate_quote_number();

CREATE OR REPLACE FUNCTION public.generate_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Generate sequential quote number for each user
    SELECT COALESCE(MAX(quote_number), 0) + 1 
    INTO NEW.quote_number
    FROM pricing_quotes 
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_bpoc_employees_updated_at();

CREATE OR REPLACE FUNCTION public.update_bpoc_employees_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_candidate_views_updated_at();

CREATE OR REPLACE FUNCTION public.update_candidate_views_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_content_views_updated_at();

CREATE OR REPLACE FUNCTION public.update_content_views_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_user_stats();

CREATE OR REPLACE FUNCTION public.update_user_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update user's updated_at timestamp
  UPDATE users 
  SET updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_user_stats_on_page_visit();

CREATE OR REPLACE FUNCTION public.update_user_stats_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update user's updated_at timestamp
    UPDATE users SET updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;
