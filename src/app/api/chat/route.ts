import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    // Debug: Check if API key is loaded
    console.log('API Key loaded:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length || 0);
    
    const { message, conversationHistory, userId }: { message: string; conversationHistory: Array<{ role: string; content: string }>; userId?: string } = await request.json();

    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Prepare conversation context for Claude
    const messages = conversationHistory.map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content
    }));

    // Add the current user message
    messages.push({
      role: 'user' as const,
      content: message
    });

    // Create system prompt for ShoreAgents context
    const systemPrompt = `You are ShoreAgents AI, a virtual assistant for ShoreAgents - a company that provides outsourcing services for real estate, construction, engineering, and other industries. 

Your role is to help users understand ShoreAgents' services, answer questions about their offerings, and provide helpful information about:
- Real estate outsourcing services
- Construction team outsourcing
- Engineering support
- Property management assistance
- Virtual assistant services
- Team building and recruitment services
- Case studies and success stories
- Pricing and getting started

Be professional, helpful, and knowledgeable about ShoreAgents' business. If you don't know specific details about their services, suggest they contact the company directly or visit their website for more information.

Keep responses concise but informative, and always maintain a helpful and professional tone.`;

    console.log('Sending request to Anthropic API...');
    console.log('Message:', message);
    console.log('Conversation history length:', conversationHistory.length);

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    console.log('Anthropic API response received');

    // Extract the response content
    const aiResponse = response.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }

    return NextResponse.json({
      content: aiResponse.text,
      components: [],
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Anthropic API key.' },
        { status: 401 }
      );
    }
    
    // Check if it's a rate limit issue
    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
