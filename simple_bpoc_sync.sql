-- Simplified BPOC Sync Function
-- This version is more robust and easier to debug

-- First, ensure we have the http extension
CREATE EXTENSION IF NOT EXISTS http;

-- Simple test function
CREATE OR REPLACE FUNCTION test_bpoc_api()
RETURNS TEXT AS $$
DECLARE
    response TEXT;
BEGIN
    SELECT content INTO response
    FROM http((
        'GET',
        'https://www.bpoc.io/api/public/user-data',
        ARRAY[http_header('Accept', 'application/json')],
        NULL,
        NULL
    )::http_request);
    
    RETURN 'API Response length: ' || LENGTH(response) || ' characters';
EXCEPTION WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Simplified sync function with better error handling
CREATE OR REPLACE FUNCTION sync_bpoc_employees_simple()
RETURNS TABLE(
    status TEXT,
    message TEXT,
    details JSONB
) AS $$
DECLARE
    http_response TEXT;
    api_response JSONB;
    employee_data JSONB;
    total_fetched INTEGER := 0;
    new_employees INTEGER := 0;
    updated_employees INTEGER := 0;
    errors INTEGER := 0;
    error_details TEXT[] := '{}';
BEGIN
    -- Step 1: Make API call
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Step 2: Parse JSON
        api_response := http_response::JSONB;
        
        -- Step 3: Validate response
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT 
                'ERROR'::TEXT, 
                'API returned unsuccessful response'::TEXT, 
                api_response;
            RETURN;
        END IF;
        
        -- Step 4: Process employees
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_fetched := total_fetched + 1;
            
            BEGIN
                -- Try to insert or update
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
                    COALESCE((employee_data->>'overall_score')::INTEGER, 0),
                    COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                    employee_data->'experience_snapshot',
                    CASE 
                        WHEN employee_data->>'expected_salary' IS NOT NULL 
                        THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                        ELSE NULL 
                    END,
                    employee_data->>'work_status',
                    COALESCE((employee_data->>'work_status_completed')::BOOLEAN, FALSE),
                    COALESCE((employee_data->>'user_created_at')::TIMESTAMPTZ, CURRENT_TIMESTAMP),
                    COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                    COALESCE(employee_data->'improvements', '[]'::jsonb),
                    COALESCE(employee_data->'recommendations', '[]'::jsonb),
                    employee_data->>'improved_summary',
                    employee_data->'strengths_analysis'
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    full_name = EXCLUDED.full_name,
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    current_position = EXCLUDED.current_position,
                    position = EXCLUDED.position,
                    location = EXCLUDED.location,
                    avatar_url = EXCLUDED.avatar_url,
                    bio = EXCLUDED.bio,
                    overall_score = EXCLUDED.overall_score,
                    skills_snapshot = EXCLUDED.skills_snapshot,
                    experience_snapshot = EXCLUDED.experience_snapshot,
                    expected_salary = EXCLUDED.expected_salary,
                    work_status = EXCLUDED.work_status,
                    work_status_completed = EXCLUDED.work_status_completed,
                    user_created_at = EXCLUDED.user_created_at,
                    key_strengths = EXCLUDED.key_strengths,
                    improvements = EXCLUDED.improvements,
                    recommendations = EXCLUDED.recommendations,
                    improved_summary = EXCLUDED.improved_summary,
                    strengths_analysis = EXCLUDED.strengths_analysis,
                    updated_at = CURRENT_TIMESTAMP;
                
                -- Check if it was an insert or update
                IF FOUND THEN
                    updated_employees := updated_employees + 1;
                ELSE
                    new_employees := new_employees + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                errors := errors + 1;
                error_details := array_append(error_details, 
                    'User ID: ' || COALESCE(employee_data->>'user_id', 'NULL') || 
                    ' - Error: ' || SQLERRM);
            END;
        END LOOP;
        
        -- Return success
        RETURN QUERY SELECT 
            'SUCCESS'::TEXT,
            'Sync completed successfully'::TEXT,
            jsonb_build_object(
                'total_fetched', total_fetched,
                'new_employees', new_employees,
                'updated_employees', updated_employees,
                'errors', errors,
                'error_details', to_jsonb(error_details)
            );
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'ERROR'::TEXT, 
            'Failed to fetch from API: ' || SQLERRM::TEXT,
            NULL::JSONB;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to check current data
CREATE OR REPLACE FUNCTION check_bpoc_data()
RETURNS TABLE(
    total_employees BIGINT,
    latest_employee TEXT,
    latest_created_at TIMESTAMPTZ,
    sample_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_employees,
        MAX(full_name) as latest_employee,
        MAX(created_at) as latest_created_at,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'user_id', user_id,
                    'full_name', full_name,
                    'position', position,
                    'overall_score', overall_score
                )
            )
            FROM bpoc_employees 
            ORDER BY created_at DESC 
            LIMIT 3
        ) as sample_data
    FROM bpoc_employees;
END;
$$ LANGUAGE plpgsql;
