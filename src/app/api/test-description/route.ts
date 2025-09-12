import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { roleTitle, industry } = await request.json();
    
    // Simple test response
    const testDescription = `This is a test description for the role "${roleTitle}" in the ${industry || 'general'} industry. The role involves key responsibilities and requires relevant skills and experience.`;
    
    return NextResponse.json({ 
      suggestions: testDescription,
      test: true 
    });
  } catch (error) {
    console.error('Test description error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}
