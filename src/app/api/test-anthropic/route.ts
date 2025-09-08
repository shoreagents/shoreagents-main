import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET() {
  try {
    // Check if API key is available
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    
    if (!hasApiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'ANTHROPIC_API_KEY environment variable is not set',
        hasApiKey: false,
        environment: process.env.NODE_ENV
      }, { status: 500 });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Test API connection with a simple request
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }],
    });

    return NextResponse.json({ 
      success: true, 
      message: 'API connection successful',
      hasApiKey: true,
      environment: process.env.NODE_ENV,
      response: response.content[0],
      usage: response.usage
    });

  } catch (error) {
    console.error('Anthropic API test error:', error);
    
    let errorDetails = {
      success: false,
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    if (error instanceof Error) {
      errorDetails = {
        ...errorDetails,
        errorType: error.constructor.name,
        errorMessage: error.message,
        // Check for specific error types
        isAuthError: error.message.includes('401') || error.message.includes('unauthorized'),
        isRateLimitError: error.message.includes('429') || error.message.includes('rate limit'),
        isNetworkError: error.message.includes('network') || error.message.includes('timeout'),
        isApiKeyError: error.message.includes('key') || error.message.includes('token')
      };
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
}
