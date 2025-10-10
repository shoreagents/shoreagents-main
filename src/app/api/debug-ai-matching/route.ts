import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Debug AI matching logic
    return NextResponse.json({
      success: true,
      message: 'Debug AI matching completed',
      debug: {
        input: body,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Debug AI matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}