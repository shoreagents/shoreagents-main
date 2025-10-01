-- BPOC Integration Functions
-- =========================

-- DROP FUNCTION public.fetch_bpoc_employee_by_id(text);

CREATE OR REPLACE FUNCTION public.fetch_bpoc_employee_by_id(emp_user_id text)
 RETURNS TABLE(success boolean, message text, employee_data jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT FALSE, 'BPOC API returned unsuccessful response', NULL::JSONB;
            RETURN;
        END IF;
        
        -- Find the specific employee
        SELECT jsonb_array_elements(api_response->'data') INTO employee_data
        WHERE (jsonb_array_elements(api_response->'data')->>'user_id') = emp_user_id;
        
        IF employee_data IS NULL THEN
            RETURN QUERY SELECT FALSE, 'Employee not found in BPOC API', NULL::JSONB;
        ELSE
            RETURN QUERY SELECT TRUE, 'Employee found successfully', employee_data;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT FALSE, 'Error fetching data from BPOC API: ' || SQLERRM, NULL::JSONB;
    END;
END;
$function$
;

-- DROP FUNCTION public.get_bpoc_employee_stats();

CREATE OR REPLACE FUNCTION public.get_bpoc_employee_stats()
 RETURNS TABLE(total_employees bigint, active_employees bigint, employed_employees bigint, available_employees bigint, employees_with_analysis bigint, average_score numeric, top_skills jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_employees,
        COUNT(*) FILTER (WHERE work_status_completed = true) as active_employees,
        COUNT(*) FILTER (WHERE work_status = 'employed') as employed_employees,
        COUNT(*) FILTER (WHERE work_status = 'available') as available_employees,
        COUNT(*) FILTER (WHERE key_strengths IS NOT NULL AND jsonb_array_length(key_strengths) > 0) as employees_with_analysis,
        ROUND(AVG(overall_score), 2) as average_score,
        (
            SELECT jsonb_agg(skill_data)
            FROM (
                SELECT skill, COUNT(*) as count
                FROM bpoc_employees,
                     jsonb_array_elements_text(skills_snapshot) as skill
                WHERE skills_snapshot IS NOT NULL
                GROUP BY skill
                ORDER BY COUNT(*) DESC
                LIMIT 10
            ) skill_data
        ) as top_skills
    FROM bpoc_employees;
END;
$function$
;

-- DROP FUNCTION public.sync_ai_analysis_data();

CREATE OR REPLACE FUNCTION public.sync_ai_analysis_data()
 RETURNS TABLE(total_fetched integer, new_analyses integer, updated_analyses integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    analysis_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        api_response := http_response::jsonb;
        
        -- Check if API response is successful
        IF NOT (api_response->>'success')::boolean THEN
            RAISE EXCEPTION 'BPOC API returned unsuccessful response: %', api_response->>'message';
        END IF;
        
        -- Process each employee's analysis data
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_count := total_count + 1;
            
            BEGIN
                -- Check if analysis data exists for this user
                SELECT * INTO analysis_record 
                FROM ai_analysis 
                WHERE user_id = (employee_data->>'user_id');
                
                -- Prepare analysis data
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
                        employee_data->>'user_id',
                        employee_data->>'analysis_id',
                        employee_data->>'session_id',
                        (employee_data->>'overall_score')::integer,
                        (employee_data->>'ats_compatibility_score')::integer,
                        (employee_data->>'content_quality_score')::integer,
                        (employee_data->>'professional_presentation_score')::integer,
                        (employee_data->>'skills_alignment_score')::integer,
                        COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        COALESCE(employee_data->'improvements', '[]'::jsonb),
                        COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        employee_data->>'improved_summary',
                        employee_data->'strengths_analysis',
                        employee_data->'salary_analysis',
                        employee_data->'career_path',
                        employee_data->'section_analysis',
                        employee_data->'candidate_profile',
                        COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        employee_data->'experience_snapshot',
                        employee_data->'education_snapshot',
                        COALESCE(employee_data->'portfolio_links', '[]'::jsonb),
                        (employee_data->>'analysis_created_at')::timestamptz,
                        (employee_data->>'analysis_updated_at')::timestamptz
                    );
                    new_count := new_count + 1;
                ELSE
                    -- Update existing analysis record
                    UPDATE ai_analysis SET
                        analysis_id = employee_data->>'analysis_id',
                        session_id = employee_data->>'session_id',
                        overall_score = (employee_data->>'overall_score')::integer,
                        ats_compatibility_score = (employee_data->>'ats_compatibility_score')::integer,
                        content_quality_score = (employee_data->>'content_quality_score')::integer,
                        professional_presentation_score = (employee_data->>'professional_presentation_score')::integer,
                        skills_alignment_score = (employee_data->>'skills_alignment_score')::integer,
                        key_strengths = COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        improvements = COALESCE(employee_data->'improvements', '[]'::jsonb),
                        recommendations = COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        improved_summary = employee_data->>'improved_summary',
                        strengths_analysis = employee_data->'strengths_analysis',
                        salary_analysis = employee_data->'salary_analysis',
                        career_path = employee_data->'career_path',
                        section_analysis = employee_data->'section_analysis',
                        candidate_profile = employee_data->'candidate_profile',
                        skills_snapshot = COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        experience_snapshot = employee_data->'experience_snapshot',
                        education_snapshot = employee_data->'education_snapshot',
                        portfolio_links = COALESCE(employee_data->'portfolio_links', '[]'::jsonb),
                        analysis_created_at = (employee_data->>'analysis_created_at')::timestamptz,
                        analysis_updated_at = (employee_data->>'analysis_updated_at')::timestamptz
                    WHERE user_id = employee_data->>'user_id';
                    updated_count := updated_count + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error processing analysis for user %: %', employee_data->>'user_id', SQLERRM;
            END;
        END LOOP;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error fetching BPOC API data: %', SQLERRM;
    END;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$
;

-- DROP FUNCTION public.sync_bpoc_employees_data();

CREATE OR REPLACE FUNCTION public.sync_bpoc_employees_data()
 RETURNS TABLE(total_fetched integer, new_employees integer, updated_employees integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    employee_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RAISE EXCEPTION 'BPOC API returned unsuccessful response: %', api_response;
        END IF;
        
        -- Process each employee in the response
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_count := total_count + 1;
            
            BEGIN
                -- Check if employee already exists
                SELECT * INTO employee_record 
                FROM bpoc_employees 
                WHERE user_id = employee_data->>'user_id';
                
                IF FOUND THEN
                    -- Update existing employee
                    UPDATE bpoc_employees SET
                        full_name = COALESCE(employee_data->>'full_name', full_name),
                        first_name = COALESCE(employee_data->>'first_name', first_name),
                        last_name = COALESCE(employee_data->>'last_name', last_name),
                        current_position = COALESCE(employee_data->>'current_position', current_position),
                        position = COALESCE(employee_data->>'position', position),
                        location = COALESCE(employee_data->>'location', location),
                        avatar_url = COALESCE(employee_data->>'avatar_url', avatar_url),
                        bio = COALESCE(employee_data->>'bio', bio),
                        overall_score = COALESCE((employee_data->>'overall_score')::INTEGER, overall_score),
                        skills_snapshot = COALESCE(employee_data->'skills_snapshot', skills_snapshot),
                        experience_snapshot = COALESCE(employee_data->'experience_snapshot', experience_snapshot),
                        expected_salary = COALESCE(
                            CASE 
                                WHEN employee_data->>'expected_salary' IS NOT NULL 
                                THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                                ELSE expected_salary 
                            END, 
                            expected_salary
                        ),
                        work_status = COALESCE(employee_data->>'work_status', work_status),
                        work_status_completed = COALESCE((employee_data->>'work_status_completed')::BOOLEAN, work_status_completed),
                        user_created_at = COALESCE(
                            (employee_data->>'user_created_at')::TIMESTAMPTZ, 
                            user_created_at
                        ),
                        key_strengths = COALESCE(employee_data->'key_strengths', key_strengths),
                        improvements = COALESCE(employee_data->'improvements', improvements),
                        recommendations = COALESCE(employee_data->'recommendations', recommendations),
                        improved_summary = COALESCE(employee_data->>'improved_summary', improved_summary),
                        strengths_analysis = COALESCE(employee_data->'strengths_analysis', strengths_analysis),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = employee_data->>'user_id';
                    
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
                        employee_data->>'user_id',
                        employee_data->>'full_name',
                        employee_data->>'first_name',
                        employee_data->>'last_name',
                        employee_data->>'current_position',
                        employee_data->>'position',
                        employee_data->>'location',
                        employee_data->>'avatar_url',
                        employee_data->>'bio',
                        (employee_data->>'overall_score')::INTEGER,
                        COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        employee_data->'experience_snapshot',
                        CASE 
                            WHEN employee_data->>'expected_salary' IS NOT NULL 
                            THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                            ELSE NULL 
                        END,
                        employee_data->>'work_status',
                        (employee_data->>'work_status_completed')::BOOLEAN,
                        (employee_data->>'user_created_at')::TIMESTAMPTZ,
                        COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        COALESCE(employee_data->'improvements', '[]'::jsonb),
                        COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        employee_data->>'improved_summary',
                        employee_data->'strengths_analysis'
                    );
                    
                    new_count := new_count + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error processing employee %: %', employee_data->>'user_id', SQLERRM;
            END;
        END LOOP;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error fetching data from BPOC API: %', SQLERRM;
    END;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$
;

-- DROP FUNCTION public.test_bpoc_api_connection();

CREATE OR REPLACE FUNCTION public.test_bpoc_api_connection()
 RETURNS TABLE(success boolean, message text, response_size integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    http_response TEXT;
    api_response JSONB;
BEGIN
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        api_response := http_response::JSONB;
        
        IF (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT 
                TRUE, 
                'BPOC API connection successful', 
                jsonb_array_length(api_response->'data');
        ELSE
            RETURN QUERY SELECT 
                FALSE, 
                'BPOC API returned unsuccessful response', 
                0;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            FALSE, 
            'BPOC API connection error: ' || SQLERRM, 
            0;
    END;
END;
$function$
;

-- DROP FUNCTION public.test_http_extension();

CREATE OR REPLACE FUNCTION public.test_http_extension()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Try to make a simple HTTP request
    BEGIN
        PERFORM content FROM http((
            'GET',
            'https://httpbin.org/get',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        RETURN 'HTTP extension is working correctly';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'HTTP extension error: ' || SQLERRM;
    END;
END;
$function$
;
