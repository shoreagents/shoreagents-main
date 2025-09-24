-- Update the record_candidate_view function to not depend on bpoc_employees table

-- Drop the existing function
DROP FUNCTION IF EXISTS record_candidate_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50));

-- Create the updated function that doesn't depend on bpoc_employees
CREATE OR REPLACE FUNCTION record_candidate_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
BEGIN
    -- Insert new view record with the provided candidate name
    -- No need to look up in bpoc_employees table since we get the name from BPOC API
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment for the updated function
COMMENT ON FUNCTION record_candidate_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50)) 
IS 'Records a candidate view or interaction with candidate name from BPOC API';

-- Test the updated function
SELECT 'Testing updated record_candidate_view function...' as test;
SELECT record_candidate_view(
    'test_user_bpoc'::VARCHAR(255),
    'test_candidate_bpoc'::VARCHAR(255),
    'John Doe from BPOC API'::VARCHAR(255),
    30::INTEGER,
    'view'::VARCHAR(50)
);

-- Verify the insert worked
SELECT 'Verifying insert with BPOC candidate name...' as test;
SELECT user_id, candidate_id, candidate_name, interaction_type, view_duration 
FROM candidate_views 
WHERE user_id = 'test_user_bpoc' AND candidate_id = 'test_candidate_bpoc';

-- Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_bpoc';

SELECT 'Updated function works correctly!' as status;
