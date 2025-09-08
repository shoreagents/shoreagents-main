import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchKnowledge, knowledgeBase } from '@/lib/knowledge-base';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const rateLimitKey = clientIP;
    
    const rateLimitData = rateLimitMap.get(rateLimitKey);
    if (rateLimitData) {
      if (now < rateLimitData.resetTime) {
        if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        rateLimitData.count++;
      } else {
        rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Check if API key is available (without logging sensitive information)
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { message, conversationHistory }: { message: string; conversationHistory: Array<{ role: string; content: string }>; userId?: string } = requestBody;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 4000 characters.' },
        { status: 400 }
      );
    }

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Conversation history must be an array' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!hasApiKey) {
      console.error('API key not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
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

    // Search knowledge base for relevant information
    const relevantKnowledge = searchKnowledge(message);
    
    // Also search for specific trigger phrases that should always include links
    const triggerPhrases = [
      { phrase: 'talent pool', knowledgeId: 'talent-pool' },
      { phrase: 'team location', knowledgeId: 'team-location' },
      { phrase: 'where are you located', knowledgeId: 'team-location' },
      { phrase: 'hire team', knowledgeId: 'hire-team' },
      { phrase: 'case studies', knowledgeId: 'case-studies' },
      { phrase: 'testimonials', knowledgeId: 'testimonials' },
      { phrase: 'contact', knowledgeId: 'contact-us' },
      { phrase: 'pricing', knowledgeId: 'pricing-overview' },
      { phrase: 'how it works', knowledgeId: 'how-it-works' },
      { phrase: 'virtual assistant', knowledgeId: 'virtual-assistant' },
      { phrase: 'real estate virtual assistant', knowledgeId: 'real-estate-va' },
      { phrase: 'property management assistant', knowledgeId: 'property-management-va' },
      { phrase: 'customer service', knowledgeId: 'customer-service' },
      { phrase: 'engineering support', knowledgeId: 'engineering-support' },
      { phrase: 'marketing team', knowledgeId: 'marketing-team' },
      { phrase: 'finance', knowledgeId: 'finance-accounting' },
      { phrase: 'accounting', knowledgeId: 'finance-accounting' }
    ];
    
    // Add specific knowledge items based on trigger phrases
    const messageLower = message.toLowerCase();
    const triggeredKnowledge = triggerPhrases
      .filter(trigger => messageLower.includes(trigger.phrase))
      .map(trigger => knowledgeBase.find(item => item.id === trigger.knowledgeId))
      .filter(Boolean);
    
    // Combine search results with triggered knowledge, removing duplicates
    const allRelevantKnowledge = [...relevantKnowledge];
    triggeredKnowledge.forEach(item => {
      if (item && !allRelevantKnowledge.find(existing => existing.id === item.id)) {
        allRelevantKnowledge.push(item);
      }
    });
    
    // Create system prompt for ShoreAgents context with knowledge base information
    const knowledgeContext = allRelevantKnowledge.length > 0 
      ? `\n\nRelevant information from our knowledge base:\n${allRelevantKnowledge.map(item => `- ${item.title}: ${item.content}`).join('\n')}`
      : '';

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

When providing information about services, team members, or processes, mention that users can learn more by visiting the relevant pages on our website.

Keep responses concise but informative, and always maintain a helpful and professional tone.${knowledgeContext}`;

    // Log request details (without sensitive information)
    console.log('Processing chat request...');
    console.log('Message length:', message.length);
    console.log('Conversation history length:', conversationHistory.length);

    // Call Anthropic API
    const anthropicResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    console.log('API response received successfully');

    // Extract the response content
    const aiResponse = anthropicResponse.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }

    // Prepare related content with clickable links
    const relatedContent = allRelevantKnowledge
      .filter(item => item.url) // Only include items with URLs
      .map(item => ({
        title: item.title,
        content: item.content,
        url: item.url
      }));

    const nextResponse = NextResponse.json({
      content: aiResponse.text,
      components: relatedContent,
    });

    // Add security headers
    nextResponse.headers.set('X-Content-Type-Options', 'nosniff');
    nextResponse.headers.set('X-Frame-Options', 'DENY');
    nextResponse.headers.set('X-XSS-Protection', '1; mode=block');
    nextResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return nextResponse;

  } catch (error) {
    console.error('Chat API error occurred');
    
    // Log error details without exposing sensitive information
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      // Only log error message if it doesn't contain sensitive information
      if (!error.message.toLowerCase().includes('key') && !error.message.toLowerCase().includes('token')) {
        console.error('Error message:', error.message);
      }
    }
    
    // Handle specific error types without exposing details
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}
