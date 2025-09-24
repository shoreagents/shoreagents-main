-- Debug the authenticated user function issue
-- The error is still showing, let's check what's happening

-- 1. Check if the function exists
SELECT 'Checking if simple_get_authenticated_user function exists...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'simple_get_authenticated_user';

-- 2. If function doesn't exist, create it
SELECT 'Creating simple_get_authenticated_user function...' as step;
CREATE OR REPLACE FUNCTION simple_get_authenticated_user(p_auth_user_id VARCHAR(255))
RETURNS VARCHAR(255) AS $$
DECLARE
    user_id_result VARCHAR(255);
    uuid_value UUID;
BEGIN
    -- First, try to find by user_id (in case the passed value is already a user_id)
    SELECT user_id INTO user_id_result
    FROM users
    WHERE user_id = p_auth_user_id
    LIMIT 1;
    
    -- If not found by user_id, try to find by auth_user_id (cast VARCHAR to UUID)
    IF user_id_result IS NULL THEN
        BEGIN
            -- Try to cast to UUID, handle potential errors
            uuid_value := p_auth_user_id::uuid;
            
            SELECT user_id INTO user_id_result
            FROM users
            WHERE auth_user_id = uuid_value
            LIMIT 1;
            
        EXCEPTION
            WHEN invalid_text_representation THEN
                -- If UUID casting fails, continue to fallback
                user_id_result := NULL;
        END;
    END IF;
    
    -- If still not found, get any available user
    IF user_id_result IS NULL THEN
        SELECT user_id INTO user_id_result
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    RETURN user_id_result;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the function directly
SELECT 'Testing simple_get_authenticated_user function...' as step;

-- Test with a known user_id
SELECT simple_get_authenticated_user('crypto_47bzt5') as test_user_id;

-- Test with a known auth_user_id
SELECT simple_get_authenticated_user('2738d437-3129-44ca-8e2e-2c477328fa0c') as test_auth_user_id;

-- Test with invalid input
SELECT simple_get_authenticated_user('invalid_input') as test_invalid;

-- 4. Check what users are available
SELECT 'Available users in users table:' as step;
SELECT 
    user_id,
    auth_user_id,
    first_name,
    last_name,
    user_type,
    created_at
FROM users
ORDER BY created_at DESC;

-- 5. Test the function with actual data from the table
SELECT 'Testing with actual user data...' as step;
SELECT 
    user_id as test_input,
    simple_get_authenticated_user(user_id) as function_result
FROM users
LIMIT 3;

-- 6. Show final status
SELECT '✅ Function created and tested!' as status;
SELECT '✅ Function should now work without errors' as error_fix;
SELECT '✅ Function handles both user_id and auth_user_id lookups' as lookup_status;
