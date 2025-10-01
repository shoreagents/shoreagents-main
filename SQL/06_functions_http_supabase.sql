-- HTTP Functions for Supabase (Modified)
-- ======================================
-- Note: Supabase doesn't support the HTTP extension due to security restrictions
-- This file contains alternative approaches for HTTP functionality

-- Since HTTP extension is not available in Supabase, we'll create
-- application-friendly functions that work with data passed from your app

-- DROP FUNCTION public.sync_bpoc_employees_data_supabase(jsonb);

CREATE OR REPLACE FUNCTION public.sync_bpoc_employees_data_supabase(employee_data jsonb)
 RETURNS TABLE(total_processed integer, new_employees integer, updated_employees integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    employee_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    employee_item JSONB;
BEGIN
    -- Process each employee in the provided data
    FOR employee_item IN SELECT * FROM jsonb_array_elements(employee_data)
    LOOP
        total_count := total_count + 1;
        
        BEGIN
            -- Check if employee already exists
            SELECT * INTO employee_record 
            FROM bpoc_employees 
            WHERE user_id = employee_item->>'user_id';
            
            IF FOUND THEN
                -- Update existing employee
                UPDATE bpoc_employees SET
                    full_name = COALESCE(employee_item->>'full_name', full_name),
                    first_name = COALESCE(employee_item->>'first_name', first_name),
                    last_name = COALESCE(employee_item->>'last_name', last_name),
                    current_position = COALESCE(employee_item->>'current_position', current_position),
                    position = COALESCE(employee_item->>'position', position),
                    location = COALESCE(employee_item->>'location', location),
                    avatar_url = COALESCE(employee_item->>'avatar_url', avatar_url),
                    bio = COALESCE(employee_item->>'bio', bio),
                    overall_score = COALESCE((employee_item->>'overall_score')::INTEGER, overall_score),
                    skills_snapshot = COALESCE(employee_item->'skills_snapshot', skills_snapshot),
                    experience_snapshot = COALESCE(employee_item->'experience_snapshot', experience_snapshot),
                    expected_salary = COALESCE(
                        CASE 
                            WHEN employee_item->>'expected_salary' IS NOT NULL 
                            THEN (regexp_replace(employee_item->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                            ELSE expected_salary 
                        END, 
                        expected_salary
                    ),
                    work_status = COALESCE(employee_item->>'work_status', work_status),
                    work_status_completed = COALESCE((employee_item->>'work_status_completed')::BOOLEAN, work_status_completed),
                    user_created_at = COALESCE(
                        (employee_item->>'user_created_at')::TIMESTAMPTZ, 
                        user_created_at
                    ),
                    key_strengths = COALESCE(employee_item->'key_strengths', key_strengths),
                    improvements = COALESCE(employee_item->'improvements', improvements),
                    recommendations = COALESCE(employee_item->'recommendations', recommendations),
                    improved_summary = COALESCE(employee_item->>'improved_summary', improved_summary),
                    strengths_analysis = COALESCE(employee_item->'strengths_analysis', strengths_analysis),
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = employee_item->>'user_id';
                
                updated_count := updated_count + 1;
            ELSE
                -- Insert new employee
                INSERT INTO bpoc_employees (
                    user_id,
                    full_name,
                    first_name,
                    last_name,
                    current_position,
                    position,
                    location,
                    avatar_url,
                    bio,
                    overall_score,
                    skills_snapshot,
                    experience_snapshot,
                    expected_salary,
                    work_status,
                    work_status_completed,
                    user_created_at,
                    key_strengths,
                    improvements,
                    recommendations,
                    improved_summary,
                    strengths_analysis
                ) VALUES (
                    employee_item->>'user_id',
                    employee_item->>'full_name',
                    employee_item->>'first_name',
                    employee_item->>'last_name',
                    employee_item->>'current_position',
                    employee_item->>'position',
                    employee_item->>'location',
                    employee_item->>'avatar_url',
                    employee_item->>'bio',
                    (employee_item->>'overall_score')::INTEGER,
                    COALESCE(employee_item->'skills_snapshot', '[]'::jsonb),
                    employee_item->'experience_snapshot',
                    CASE 
                        WHEN employee_item->>'expected_salary' IS NOT NULL 
                        THEN (regexp_replace(employee_item->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                        ELSE NULL 
                    END,
                    employee_item->>'work_status',
                    (employee_item->>'work_status_completed')::BOOLEAN,
                    (employee_item->>'user_created_at')::TIMESTAMPTZ,
                    COALESCE(employee_item->'key_strengths', '[]'::jsonb),
                    COALESCE(employee_item->'improvements', '[]'::jsonb),
                    COALESCE(employee_item->'recommendations', '[]'::jsonb),
                    employee_item->>'improved_summary',
                    employee_item->'strengths_analysis'
                );
                
                new_count := new_count + 1;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Error processing employee %: %', employee_item->>'user_id', SQLERRM;
        END;
    END LOOP;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$;

-- DROP FUNCTION public.sync_ai_analysis_data_supabase(jsonb);

CREATE OR REPLACE FUNCTION public.sync_ai_analysis_data_supabase(analysis_data jsonb)
 RETURNS TABLE(total_processed integer, new_analyses integer, updated_analyses integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    analysis_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    analysis_item JSONB;
BEGIN
    -- Process each analysis in the provided data
    FOR analysis_item IN SELECT * FROM jsonb_array_elements(analysis_data)
    LOOP
        total_count := total_count + 1;
        
        BEGIN
            -- Check if analysis data exists for this user
            SELECT * INTO analysis_record 
            FROM ai_analysis 
            WHERE user_id = analysis_item->>'user_id';
            
            IF analysis_record IS NULL THEN
                -- Insert new analysis record
                INSERT INTO ai_analysis (
                    user_id,
                    analysis_id,
                    session_id,
                    overall_score,
                    ats_compatibility_score,
                    content_quality_score,
                    professional_presentation_score,
                    skills_alignment_score,
                    key_strengths,
                    improvements,
                    recommendations,
                    improved_summary,
                    strengths_analysis,
                    salary_analysis,
                    career_path,
                    section_analysis,
                    candidate_profile,
                    skills_snapshot,
                    experience_snapshot,
                    education_snapshot,
                    portfolio_links,
                    analysis_created_at,
                    analysis_updated_at
                ) VALUES (
                    analysis_item->>'user_id',
                    analysis_item->>'analysis_id',
                    analysis_item->>'session_id',
                    (analysis_item->>'overall_score')::integer,
                    (analysis_item->>'ats_compatibility_score')::integer,
                    (analysis_item->>'content_quality_score')::integer,
                    (analysis_item->>'professional_presentation_score')::integer,
                    (analysis_item->>'skills_alignment_score')::integer,
                    COALESCE(analysis_item->'key_strengths', '[]'::jsonb),
                    COALESCE(analysis_item->'improvements', '[]'::jsonb),
                    COALESCE(analysis_item->'recommendations', '[]'::jsonb),
                    analysis_item->>'improved_summary',
                    analysis_item->'strengths_analysis',
                    analysis_item->'salary_analysis',
                    analysis_item->'career_path',
                    analysis_item->'section_analysis',
                    analysis_item->'candidate_profile',
                    COALESCE(analysis_item->'skills_snapshot', '[]'::jsonb),
                    analysis_item->'experience_snapshot',
                    analysis_item->'education_snapshot',
                    COALESCE(analysis_item->'portfolio_links', '[]'::jsonb),
                    (analysis_item->>'analysis_created_at')::timestamptz,
                    (analysis_item->>'analysis_updated_at')::timestamptz
                );
                new_count := new_count + 1;
            ELSE
                -- Update existing analysis record
                UPDATE ai_analysis SET
                    analysis_id = analysis_item->>'analysis_id',
                    session_id = analysis_item->>'session_id',
                    overall_score = (analysis_item->>'overall_score')::integer,
                    ats_compatibility_score = (analysis_item->>'ats_compatibility_score')::integer,
                    content_quality_score = (analysis_item->>'content_quality_score')::integer,
                    professional_presentation_score = (analysis_item->>'professional_presentation_score')::integer,
                    skills_alignment_score = (analysis_item->>'skills_alignment_score')::integer,
                    key_strengths = COALESCE(analysis_item->'key_strengths', '[]'::jsonb),
                    improvements = COALESCE(analysis_item->'improvements', '[]'::jsonb),
                    recommendations = COALESCE(analysis_item->'recommendations', '[]'::jsonb),
                    improved_summary = analysis_item->>'improved_summary',
                    strengths_analysis = analysis_item->'strengths_analysis',
                    salary_analysis = analysis_item->'salary_analysis',
                    career_path = analysis_item->'career_path',
                    section_analysis = analysis_item->'section_analysis',
                    candidate_profile = analysis_item->'candidate_profile',
                    skills_snapshot = COALESCE(analysis_item->'skills_snapshot', '[]'::jsonb),
                    experience_snapshot = analysis_item->'experience_snapshot',
                    education_snapshot = analysis_item->'education_snapshot',
                    portfolio_links = COALESCE(analysis_item->'portfolio_links', '[]'::jsonb),
                    analysis_created_at = (analysis_item->>'analysis_created_at')::timestamptz,
                    analysis_updated_at = (analysis_item->>'analysis_updated_at')::timestamptz
                WHERE user_id = analysis_item->>'user_id';
                updated_count := updated_count + 1;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Error processing analysis for user %: %', analysis_item->>'user_id', SQLERRM;
        END;
    END LOOP;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$;

-- DROP FUNCTION public.test_bpoc_connection_supabase();

CREATE OR REPLACE FUNCTION public.test_bpoc_connection_supabase()
 RETURNS TABLE(success boolean, message text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Since we can't make HTTP calls from the database in Supabase,
    -- this function just returns a success message
    -- The actual HTTP testing should be done in your application code
    
    RETURN QUERY SELECT 
        TRUE, 
        'BPOC connection test should be performed from application layer using fetch() or similar HTTP client';
END;
$function$;
