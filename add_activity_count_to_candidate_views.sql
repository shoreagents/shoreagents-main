-- Add activity_count column to candidate_views table
-- This column will increment by 1 when the same interaction_type is repeated for the same user-candidate combination

-- 1. Add the activity_count column
ALTER TABLE public.candidate_views 
ADD COLUMN activity_count INTEGER DEFAULT 1 NOT NULL;

-- 2. Add a check constraint to ensure activity_count is always positive
ALTER TABLE public.candidate_views 
ADD CONSTRAINT candidate_views_activity_count_check 
CHECK (activity_count > 0);

-- 3. Create an index on activity_count for better performance
CREATE INDEX idx_candidate_views_activity_count 
ON public.candidate_views USING btree (activity_count);

-- 4. Create a function to handle activity count increment
CREATE OR REPLACE FUNCTION increment_activity_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there's an existing record with the same user_id, candidate_id, and interaction_type
    -- If yes, increment the activity_count; if no, keep it as 1 (default)
    IF EXISTS (
        SELECT 1 FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0)  -- Exclude current record if updating
    ) THEN
        -- Get the maximum activity_count for this combination and increment it
        SELECT COALESCE(MAX(activity_count), 0) + 1 
        INTO NEW.activity_count
        FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0);
    ELSE
        -- First time this interaction type for this user-candidate combination
        NEW.activity_count := 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a trigger to automatically increment activity_count
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;
CREATE TRIGGER trigger_increment_activity_count
    BEFORE INSERT OR UPDATE ON candidate_views
    FOR EACH ROW
    EXECUTE FUNCTION increment_activity_count();

-- 6. Update existing records to have proper activity_count values
-- This will set activity_count based on the order of creation for each user-candidate-interaction combination
WITH ranked_views AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, candidate_id, interaction_type 
            ORDER BY created_at ASC
        ) as activity_count
    FROM candidate_views
)
UPDATE candidate_views 
SET activity_count = ranked_views.activity_count
FROM ranked_views
WHERE candidate_views.id = ranked_views.id;

-- 7. Add a comment to explain the column
COMMENT ON COLUMN candidate_views.activity_count IS 'Increments by 1 each time the same interaction_type is repeated for the same user-candidate combination';

-- 8. Test the functionality
SELECT 'Testing activity_count functionality...' as step;

-- Insert test records to verify the increment works
INSERT INTO public.candidate_views (user_id, candidate_id, candidate_name, interaction_type)
VALUES 
    ('crypto_47bzt5', 'test_candidate_activity', 'Test Candidate Activity', 'view'),
    ('crypto_47bzt5', 'test_candidate_activity', 'Test Candidate Activity', 'view'),
    ('crypto_47bzt5', 'test_candidate_activity', 'Test Candidate Activity', 'favorite'),
    ('crypto_47bzt5', 'test_candidate_activity', 'Test Candidate Activity', 'view'),
    ('crypto_47bzt5', 'test_candidate_activity', 'Test Candidate Activity', 'favorite');

-- Check the results
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id = 'test_candidate_activity'
ORDER BY interaction_type, created_at;

-- 9. Clean up test records
DELETE FROM candidate_views 
WHERE candidate_id = 'test_candidate_activity';

-- 10. Show final status
SELECT '✅ activity_count column added successfully!' as status;
SELECT '✅ Trigger created to auto-increment activity_count' as trigger_status;
SELECT '✅ Existing records updated with proper activity_count values' as update_status;

-- 11. Show the updated table structure
SELECT 'Updated candidate_views table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
