# Candidate Views Fix - Usage Guide

## Problem Summary
Your `candidate_views` table had the following issues:
1. **Duplicate entries** - Same user-candidate combinations appearing multiple times
2. **Zero view_duration** - Most entries showing 0 or very low view_duration values  
3. **Data inconsistency** - Multiple records for the same interaction instead of updates

## Solution Overview

### 1. Immediate Fix (Run `immediate_fix_candidate_views.sql`)
This script will:
- Clean up existing duplicate records
- Consolidate data by keeping the best record for each user-candidate-interaction combination
- Update remaining records with consolidated metrics
- Create improved functions to prevent future duplicates

### 2. New Functions to Use

#### `record_candidate_view_fixed()`
**Use this instead of the old functions for new implementations**

```sql
-- Basic usage
SELECT record_candidate_view_fixed(
    'device_83vw09',                    -- user_id
    '8f716b64-02a3-46c2-9141-cc5b2312dd99',  -- candidate_id
    'Charmine Salas',                   -- candidate_name
    15,                                 -- view_duration (seconds)
    'view',                             -- interaction_type
    75                                  -- scroll_percentage
);
```

#### `track_view_with_duration()`
**Use this for proper duration tracking with timestamps**

```sql
-- Track view with proper duration calculation
SELECT track_view_with_duration(
    'device_83vw09',                    -- user_id
    '8f716b64-02a3-46c2-9141-cc5b2312dd99',  -- candidate_id
    'Charmine Salas',                   -- candidate_name
    '2025-09-26 14:37:32.113+08:00',   -- start_time
    '2025-09-26 14:37:39.820+08:00',   -- end_time
    75,                                 -- scroll_percentage
    'view'                              -- interaction_type
);
```

## Frontend Implementation

### JavaScript/TypeScript Example

```javascript
class CandidateViewTracker {
    constructor() {
        this.viewStartTime = null;
        this.currentCandidateId = null;
        this.currentUserId = null;
    }

    // Start tracking a view
    startView(userId, candidateId, candidateName) {
        this.viewStartTime = new Date();
        this.currentCandidateId = candidateId;
        this.currentUserId = userId;
        
        // Record initial view
        this.recordView(userId, candidateId, candidateName, 0, 'view', 0);
    }

    // End tracking and record final duration
    endView(scrollPercentage = 0) {
        if (!this.viewStartTime || !this.currentCandidateId) return;
        
        const endTime = new Date();
        const duration = Math.floor((endTime - this.viewStartTime) / 1000);
        
        // Record final view with duration
        this.recordView(
            this.currentUserId,
            this.currentCandidateId,
            null, // candidate_name (will use existing)
            duration,
            'view',
            scrollPercentage
        );
        
        // Reset tracking
        this.viewStartTime = null;
        this.currentCandidateId = null;
        this.currentUserId = null;
    }

    // Record interaction (click, favorite, etc.)
    recordInteraction(interactionType, scrollPercentage = 0) {
        if (!this.currentCandidateId) return;
        
        this.recordView(
            this.currentUserId,
            this.currentCandidateId,
            null,
            null, // duration (will use existing)
            interactionType,
            scrollPercentage
        );
    }

    // Private method to call the API
    async recordView(userId, candidateId, candidateName, duration, interactionType, scrollPercentage) {
        try {
            const response = await fetch('/api/candidate-views', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    candidate_id: candidateId,
                    candidate_name: candidateName,
                    view_duration: duration,
                    interaction_type: interactionType,
                    scroll_percentage: scrollPercentage
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error recording candidate view:', error);
        }
    }
}

// Usage
const tracker = new CandidateViewTracker();

// When user opens a candidate profile
tracker.startView('device_83vw09', '8f716b64-02a3-46c2-9141-cc5b2312dd99', 'Charmine Salas');

// When user scrolls (update scroll percentage)
tracker.recordInteraction('scroll', 50);

// When user clicks something
tracker.recordInteraction('click', 60);

// When user leaves the page
tracker.endView(75);
```

## API Endpoint Example

```typescript
// pages/api/candidate-views.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, candidate_id, candidate_name, view_duration, interaction_type, scroll_percentage } = req.body;

    try {
        // Use the new fixed function
        const { data, error } = await supabase.rpc('record_candidate_view_fixed', {
            p_user_id: user_id,
            p_candidate_id: candidate_id,
            p_candidate_name: candidate_name,
            p_view_duration: view_duration,
            p_interaction_type: interaction_type,
            p_scroll_percentage: scroll_percentage
        });

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Failed to record view' });
        }

        return res.status(200).json({ 
            success: true, 
            view_id: data,
            message: 'View recorded successfully' 
        });
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

## Key Benefits

1. **No More Duplicates**: The new functions prevent duplicate entries by updating existing records instead of creating new ones
2. **Proper Duration Tracking**: Use timestamps to calculate accurate view durations
3. **Better Data Quality**: Consolidates existing data and maintains data integrity
4. **Improved Analytics**: More accurate metrics for candidate performance analysis

## Migration Steps

1. **Run the immediate fix script** to clean up existing data
2. **Update your frontend code** to use the new tracking methods
3. **Update your API endpoints** to use the new database functions
4. **Test the implementation** with a few candidate views to ensure it's working correctly

## Monitoring

After implementing, monitor your `candidate_views` table to ensure:
- No duplicate entries are being created
- View durations are being calculated correctly
- Scroll percentages are being tracked properly
- The data quality is improving over time
