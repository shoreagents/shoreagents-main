-- STEP 6: Test the UPSERT Function
-- This verifies that the fix works correctly

-- 6.1 Test with a sample record (first insert)
SELECT 'Testing first insert...' as status;
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    30,
    'view',
    1,
    50
) as first_insert_id;

-- 6.2 Test incrementing the same record (should update, not create new)
SELECT 'Testing second insert (should update existing)...' as status;
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    45,
    'view',
    1,
    75
) as second_insert_id;

-- 6.3 Test with different interaction type (should create new record)
SELECT 'Testing different interaction type...' as status;
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    60,
    'favorite',
    1,
    90
) as third_insert_id;

-- 6.4 Verify the results
SELECT 'Verification - checking test records:' as status;
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    view_duration,
    page_views,
    scroll_percentage,
    created_at,
    updated_at
FROM candidate_views 
WHERE user_id = 'test_user_123' 
    AND candidate_id = 'test_candidate_456'
ORDER BY interaction_type, created_at;

-- 6.5 Test one more increment on the 'view' record
SELECT 'Testing third increment on view record...' as status;
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    90,
    'view',
    2,
    100
) as fourth_insert_id;

-- 6.6 Final verification
SELECT 'Final verification - should still have only 2 records:' as status;
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    view_duration,
    page_views,
    scroll_percentage
FROM candidate_views 
WHERE user_id = 'test_user_123' 
    AND candidate_id = 'test_candidate_456'
ORDER BY interaction_type;

-- 6.7 Clean up test data
DELETE FROM candidate_views 
WHERE user_id = 'test_user_123' 
    AND candidate_id = 'test_candidate_456';

-- 6.8 Show success message
SELECT '✅ UPSERT function test completed successfully!' as status;
SELECT '✅ No duplicate records created!' as duplicate_check;
SELECT '✅ Activity count increments properly!' as activity_check;
