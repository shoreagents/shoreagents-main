-- STEP 5: Create the Proper UPSERT Function
-- This replaces the problematic trigger with a proper solution

-- 5.1 Create the UPSERT function
CREATE OR REPLACE FUNCTION upsert_candidate_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view',
    p_page_views INTEGER DEFAULT 1,
    p_scroll_percentage INTEGER DEFAULT 0
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    actual_candidate_name VARCHAR(255);
BEGIN
    -- If candidate_name not provided, try to get it from bpoc_employees
    IF p_candidate_name IS NULL THEN
        SELECT full_name INTO actual_candidate_name
        FROM bpoc_employees
        WHERE user_id = p_candidate_id
        LIMIT 1;
    ELSE
        actual_candidate_name := p_candidate_name;
    END IF;
    
    -- Use UPSERT to either insert new record or update existing one
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count,
        scroll_percentage
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        actual_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        p_page_views,
        1,
        p_scroll_percentage
    )
    ON CONFLICT (user_id, candidate_id, interaction_type) 
    DO UPDATE SET 
        activity_count = candidate_views.activity_count + 1,
        view_duration = GREATEST(
            COALESCE(candidate_views.view_duration, 0), 
            COALESCE(EXCLUDED.view_duration, 0)
        ),
        page_views = candidate_views.page_views + EXCLUDED.page_views,
        candidate_name = COALESCE(EXCLUDED.candidate_name, candidate_views.candidate_name),
        scroll_percentage = GREATEST(
            COALESCE(candidate_views.scroll_percentage, 0), 
            COALESCE(EXCLUDED.scroll_percentage, 0)
        ),
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 5.2 Add comment to document the function
COMMENT ON FUNCTION upsert_candidate_view IS 'Properly handles candidate view tracking with UPSERT logic to prevent duplicates';

-- 5.3 Show success message
SELECT '✅ UPSERT function created successfully!' as status;
