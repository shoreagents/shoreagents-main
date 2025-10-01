import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry, employeeCount, company, message, user_id } = body;

    // Validate required fields
    if (!industry || !employeeCount || !message || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, employeeCount, message, and user_id are required' },
        { status: 400 }
      );
    }

    // Validate employeeCount is a positive number
    const employeeCountNum = parseInt(employeeCount);
    if (isNaN(employeeCountNum) || employeeCountNum < 1 || employeeCountNum > 100) {
      return NextResponse.json(
        { error: 'Employee count must be a number between 1 and 100' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update the user record with the inquiry data
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        industry_name: industry,
        company: company || null, // Use provided company or null if empty
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user information' },
        { status: 500 }
      );
    }

    // Log the inquiry for tracking (you could also create a separate inquiries table)
    console.log('Anonymous user inquiry received:', {
      user_id,
      industry,
      employeeCount: employeeCountNum,
      company: company || 'Not provided',
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''), // Truncate for logging
      timestamp: new Date().toISOString()
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        user_id: updatedUser.user_id,
        industry: updatedUser.industry_name,
        company: updatedUser.company,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Error processing anonymous user inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
