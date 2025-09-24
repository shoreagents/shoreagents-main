-- Debug BPOC Sync Issues
-- Run these queries one by one to identify the problem

-- 1. Check if HTTP extension is installed
SELECT * FROM pg_extension WHERE extname = 'http';

-- 2. If not installed, install it
-- CREATE EXTENSION IF NOT EXISTS http;

-- 3. Test basic HTTP functionality
SELECT test_http_extension();

-- 4. Test BPOC API connection
SELECT * FROM test_bpoc_api_connection();

-- 5. Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'bpoc_employees' 
ORDER BY ordinal_position;

-- 6. Check if functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%bpoc%' 
AND routine_schema = 'public';

-- 7. Test a simple manual API call
SELECT content FROM http((
    'GET',
    'https://www.bpoc.io/api/public/user-data',
    ARRAY[http_header('Accept', 'application/json')],
    NULL,
    NULL
)::http_request) LIMIT 1;

-- 8. Check current data in table
SELECT COUNT(*) as current_employee_count FROM bpoc_employees;

-- 9. Try the sync function with detailed error handling
DO $$
DECLARE
    result RECORD;
BEGIN
    BEGIN
        SELECT * INTO result FROM sync_bpoc_employees_data();
        RAISE NOTICE 'Sync completed successfully: % new, % updated, % errors', 
            result.new_employees, result.updated_employees, result.errors;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Sync failed with error: %', SQLERRM;
    END;
END $$;

-- 10. Alternative simple sync function (if the main one fails)
CREATE OR REPLACE FUNCTION simple_bpoc_sync()
RETURNS TEXT AS $$
DECLARE
    http_response TEXT;
    api_response JSONB;
    employee_data JSONB;
    total_count INTEGER := 0;
BEGIN
    -- Make HTTP request
    SELECT content INTO http_response
    FROM http((
        'GET',
        'https://www.bpoc.io/api/public/user-data',
        ARRAY[http_header('Accept', 'application/json')],
        NULL,
        NULL
    )::http_request);
    
    -- Parse response
    api_response := http_response::JSONB;
    
    -- Check success
    IF NOT (api_response->>'success')::BOOLEAN THEN
        RETURN 'API returned unsuccessful response: ' || api_response::TEXT;
    END IF;
    
    -- Count employees
    SELECT COUNT(*) INTO total_count
    FROM jsonb_array_elements(api_response->'data');
    
    RETURN 'Successfully fetched ' || total_count || ' employees from BPOC API';
    
EXCEPTION WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 11. Test the simple sync
SELECT simple_bpoc_sync();

-- 12. Check for any existing data issues
SELECT 
    user_id, 
    full_name, 
    overall_score, 
    work_status,
    work_status_completed,
    created_at
FROM bpoc_employees 
ORDER BY created_at DESC 
LIMIT 5;
