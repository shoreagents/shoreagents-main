import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMarketConfig, generateMarketAwarePrompt } from '../../../lib/market-intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RoleSuggestion {
  title: string;
  description: string;
  keyResponsibilities: string[];
  recommendedSetup: 'wfh' | 'hybrid' | 'office';
  priority: 'high' | 'medium' | 'low';
}

export async function POST(request: NextRequest) {
  try {
    const { industry, roleTitle, businessContext, userLocation } = await request.json();
    
    // Get market-specific configuration
    const marketConfig = getMarketConfig(userLocation?.countryCode || 'US');
    console.log('Using market config for:', marketConfig.country);

    // Generate market-aware prompt
    const prompt = generateMarketAwarePrompt(roleTitle, industry, marketConfig);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    let suggestion: RoleSuggestion;
    try {
      suggestion = JSON.parse(content.text);
    } catch (parseError) {
      // Fallback if AI doesn't return perfect JSON
      suggestion = {
        title: roleTitle,
        description: `${roleTitle} responsible for supporting ${industry} business operations with administrative and specialized tasks.`,
        keyResponsibilities: [
          'Handle daily administrative tasks',
          'Support business operations',
          'Maintain records and documentation',
          'Communicate with clients and stakeholders'
        ],
        recommendedSetup: 'wfh',
        priority: 'medium'
      };
    }

    return NextResponse.json({ suggestion });

  } catch (error) {
    console.error('Error suggesting role:', error);
    
    // Fallback response
    return NextResponse.json({
      suggestion: {
        title: 'Virtual Assistant',
        description: 'Versatile support professional handling administrative tasks and business operations.',
        keyResponsibilities: [
          'Administrative support and data entry',
          'Customer service and communication',
          'Schedule management and coordination',
          'Research and reporting tasks'
        ],
        recommendedSetup: 'wfh',
        priority: 'high'
      }
    });
  }
}
