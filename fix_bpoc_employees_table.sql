-- Fix BPOC Employees Table - Add missing columns and update functions

-- Add missing work_status_completed column
ALTER TABLE public.bpoc_employees 
ADD COLUMN IF NOT EXISTS work_status_completed BOOLEAN DEFAULT FALSE;

-- Add index for the new column
CREATE INDEX IF NOT EXISTS idx_bpoc_employees_work_status_completed 
ON public.bpoc_employees USING btree (work_status_completed);

-- Update the sync function to handle the missing column properly
CREATE OR REPLACE FUNCTION sync_bpoc_employees_data()
RETURNS TABLE(
    total_fetched INTEGER,
    new_employees INTEGER,
    updated_employees INTEGER,
    errors INTEGER
) AS $$
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
$$ LANGUAGE plpgsql;

-- Update the statistics function to handle the new column
CREATE OR REPLACE FUNCTION get_bpoc_employee_stats()
RETURNS TABLE(
    total_employees BIGINT,
    active_employees BIGINT,
    employed_employees BIGINT,
    available_employees BIGINT,
    employees_with_analysis BIGINT,
    average_score NUMERIC,
    top_skills JSONB
) AS $$
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
$$ LANGUAGE plpgsql;

-- Test function to check if http extension is available
CREATE OR REPLACE FUNCTION test_http_extension()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Simple test function to verify API connectivity
CREATE OR REPLACE FUNCTION test_bpoc_api_connection()
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    response_size INTEGER
) AS $$
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
$$ LANGUAGE plpgsql;

-- Grant permissions (uncomment and adjust as needed)
-- GRANT EXECUTE ON FUNCTION sync_bpoc_employees_data() TO your_app_user;
-- GRANT EXECUTE ON FUNCTION test_http_extension() TO your_app_user;
-- GRANT EXECUTE ON FUNCTION test_bpoc_api_connection() TO your_app_user;
-- GRANT EXECUTE ON FUNCTION get_bpoc_employee_stats() TO your_app_user;
