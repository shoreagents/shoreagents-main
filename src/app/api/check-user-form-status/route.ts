import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateUserId } from '@/lib/userEngagementService';

export async function GET(request: NextRequest) {
  try {
    // Get user_id from query params or generate one
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || generateUserId();

    const supabase = createClient();

    // Check if user exists and has filled out the form
    const { data: user, error } = await supabase
      .from('users')
      .select('company, industry_name')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user form status:', error);
      return NextResponse.json({ error: 'Failed to check user status' }, { status: 500 });
    }

    // Check if user has filled out the form
    const hasFilledForm = user && user.company && user.industry_name;

    return NextResponse.json({
      hasFilledForm: !!hasFilledForm,
      userExists: !!user,
      company: user?.company || null,
      industry: user?.industry_name || null
    });

  } catch (error) {
    console.error('Error in check-user-form-status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
