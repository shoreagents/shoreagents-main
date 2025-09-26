-- STEP 3: Add Unique Constraint to Prevent Duplicates
-- This enables proper UPSERT functionality

-- 3.1 Check if unique constraint already exists
SELECT 
    'Checking for existing unique constraints...' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'candidate_views' 
    AND table_schema = 'public'
    AND constraint_type = 'UNIQUE';

-- 3.2 Add unique constraint (only if it doesn't exist)
DO $$
BEGIN
    -- Check if unique constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_views_user_candidate_interaction_unique'
        AND table_name = 'candidate_views'
        AND table_schema = 'public'
    ) THEN
        -- Add unique constraint on user_id, candidate_id, interaction_type
        ALTER TABLE public.candidate_views 
        ADD CONSTRAINT candidate_views_user_candidate_interaction_unique 
        UNIQUE (user_id, candidate_id, interaction_type);
        
        RAISE NOTICE '✅ Unique constraint added successfully';
    ELSE
        RAISE NOTICE 'ℹ️ Unique constraint already exists';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Error adding constraint: %', SQLERRM;
    RAISE NOTICE 'This might be because duplicate records exist. Run step 4 first to clean them up.';
END $$;

-- 3.3 Verify the constraint was added
SELECT 
    'Final constraints check:' as info,
    constraint_name,
    constraint_type,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'candidate_views' 
    AND tc.table_schema = 'public'
    AND tc.constraint_type = 'UNIQUE';
