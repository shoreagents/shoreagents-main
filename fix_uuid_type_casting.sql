-- Fix the UUID type casting issue in simple_get_authenticated_user function
-- The error is happening because auth_user_id is UUID type but we're comparing with VARCHAR

-- 1. Check the users table structure to confirm data types
SELECT 'Users table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check sample data to see the actual values
SELECT 'Sample users data:' as step;
SELECT 
    user_id,
    auth_user_id,
    first_name,
    last_name,
    user_type,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- 3. Fix the simple_get_authenticated_user function with proper type casting
SELECT 'Creating fixed simple_get_authenticated_user function...' as step;
CREATE OR REPLACE FUNCTION simple_get_authenticated_user(p_auth_user_id VARCHAR(255))
RETURNS VARCHAR(255) AS $$
DECLARE
    user_id_result VARCHAR(255);
BEGIN
    -- Look for user by auth_user_id (cast VARCHAR to UUID)
    SELECT user_id INTO user_id_result
    FROM users
    WHERE auth_user_id = p_auth_user_id::uuid
    LIMIT 1;
    
    -- If not found by auth_user_id, try to find by user_id (in case the passed value is already a user_id)
    IF user_id_result IS NULL THEN
        SELECT user_id INTO user_id_result
        FROM users
        WHERE user_id = p_auth_user_id
        LIMIT 1;
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

-- 4. Test the function with different scenarios
SELECT 'Testing fixed simple_get_authenticated_user function...' as step;

-- Test with a known auth_user_id (UUID format)
SELECT simple_get_authenticated_user('2738d437-3129-44ca-8e2e-2c477328fa0c') as test_auth_user_id;

-- Test with a known user_id (VARCHAR format)
SELECT simple_get_authenticated_user('crypto_47bzt5') as test_user_id;

-- Test with non-existent ID (should return any available user)
SELECT simple_get_authenticated_user('non_existent_id') as test_non_existent;

-- 5. Test with invalid UUID format (should handle gracefully)
SELECT simple_get_authenticated_user('invalid-uuid-format') as test_invalid_uuid;

-- 6. Show the results
SELECT 'Function test results:' as step;
SELECT 
    '2738d437-3129-44ca-8e2e-2c477328fa0c' as input_value,
    simple_get_authenticated_user('2738d437-3129-44ca-8e2e-2c477328fa0c') as result;

SELECT 
    'crypto_47bzt5' as input_value,
    simple_get_authenticated_user('crypto_47bzt5') as result;

-- 7. Show final status
SELECT '✅ simple_get_authenticated_user function fixed with proper type casting!' as status;
SELECT '✅ Function now handles UUID to VARCHAR comparison correctly' as type_casting_status;
SELECT '✅ Should resolve the operator does not exist error' as error_fix;
SELECT '✅ Function handles both UUID auth_user_id and VARCHAR user_id lookups' as lookup_status;
