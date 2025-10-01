import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  console.log('=== INTERVIEW REQUEST API CALLED ===');
  try {
    const body = await request.json();
    console.log('Received data:', body);
    
    const { 
      candidateId, 
      candidateName, 
      candidatePosition, 
      requesterFirstName, 
      requesterLastName, 
      requesterEmail,
      user_id 
    } = body;

    // Validate required fields
    if (!candidateId || !candidateName || !requesterFirstName || !requesterLastName || !requesterEmail || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: candidateId, candidateName, requesterFirstName, requesterLastName, requesterEmail, and user_id are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requesterEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    console.log('Supabase service client created');

    const insertData = {
      user_id,
      candidate_id: candidateId,
      candidate_name: candidateName,
      candidate_position: candidatePosition || null,
      requester_first_name: requesterFirstName,
      requester_last_name: requesterLastName,
      requester_email: requesterEmail
    };
    
    console.log('Inserting data:', insertData);

    // Insert the interview request
    const { data: interviewRequest, error: insertError } = await supabase
      .from('interview_request')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating interview request:', insertError);
      console.error('Error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return NextResponse.json(
        { error: `Failed to create interview request: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Interview request submitted successfully',
      data: {
        id: interviewRequest.id,
        created_at: interviewRequest.created_at
      }
    });

  } catch (error) {
    console.error('Error processing interview request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve interview requests for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: interviewRequests, error } = await supabase
      .from('interview_request')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interview requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch interview requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: interviewRequests
    });

  } catch (error) {
    console.error('Error fetching interview requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
