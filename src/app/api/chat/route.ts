import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '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',
});

// Interest detection keywords
const interestKeywords = {
  realEstate: ['property', 'real estate', 'realty', 'housing', 'mortgage', 'buying', 'selling', 'rental', 'investment'],
  construction: ['construction', 'building', 'renovation', 'development', 'project management', 'contractor', 'architecture'],
  legal: ['legal', 'law', 'contract', 'compliance', 'litigation', 'regulatory', 'legal advice', 'documentation'],
  finance: ['finance', 'accounting', 'bookkeeping', 'payroll', 'tax', 'budgeting', 'financial planning', 'audit'],
  marketing: ['marketing', 'advertising', 'social media', 'seo', 'content', 'branding', 'campaign', 'lead generation'],
  design: ['design', 'graphic', 'visual', 'creative', 'branding', 'logo', 'marketing materials', 'ui/ux']
};

// Analyze user interests from current message and conversation history
function analyzeUserInterests(message: string, conversationHistory: Array<{ role: string; content: string }>): string[] {
  const allText = `${message} ${conversationHistory.map(msg => msg.content).join(' ')}`.toLowerCase();
  const detectedInterests: string[] = [];
  
  Object.entries(interestKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => allText.includes(keyword))) {
      detectedInterests.push(category);
    }
  });
  
  return detectedInterests;
}

// Find content that matches both query and user interests
function findPersonalizedContent(relevantContent: any[], userInterests: string[]): any[] {
  if (userInterests.length === 0) return relevantContent;
  
  // Prioritize content that matches user interests
  return relevantContent.sort((a, b) => {
    const aInterestScore = userInterests.some(interest => 
      a.interestTags?.includes(interest) || a.category === interest
    ) ? 1 : 0;
    const bInterestScore = userInterests.some(interest => 
      b.interestTags?.includes(interest) || b.category === interest
    ) ? 1 : 0;
    
    return bInterestScore - aInterestScore;
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, userId }: { message: string; conversationHistory: Array<{ role: string; content: string }>; userId?: string } = await request.json();

    // Import the knowledge base search function
    const { searchKnowledge } = await import('@/lib/knowledge-base');
    
    // Search for relevant content in your knowledge base
    const relevantContent = searchKnowledge(message);
    
    // Analyze user interests from conversation history
    const userInterests = analyzeUserInterests(message, conversationHistory);
    
    // Find content that matches both the query and user interests
    const personalizedContent = findPersonalizedContent(relevantContent, userInterests);
    
    // Create context from found content
    let context = '';
    if (personalizedContent.length > 0) {
      context = personalizedContent.map(item => 
        `${item.title}: ${item.content}`
      ).join('\n\n');
    }
    
    // Add interest-based recommendations
    let recommendations = '';
    if (userInterests.length > 0) {
      recommendations = `\n\nBased on your interests, you might also be interested in: ${userInterests.join(', ')}`;
    }

    // Create the system prompt with context
    const systemPrompt = `You are a helpful AI assistant for ShoreAgents, a company that provides outsourcing services including real estate, construction, legal, finance, marketing, and more.

Use the following context from our website to answer questions accurately:

${context}${recommendations}

Key information about ShoreAgents:
- We provide comprehensive outsourcing solutions
- Our services include real estate, construction, legal, finance, marketing, and more
- We have a team of experienced professionals
- We offer flexible pricing and customized solutions
- We focus on quality, reliability, and cost-effectiveness

When responding:
1. Be helpful, professional, and friendly
2. Use the context provided to give accurate information
3. If you don't have specific information, suggest contacting the team
4. Keep responses concise but informative
5. Use our brand colors (lime green, ocean blue, energy orange) when describing visual elements
6. Be conversational and natural - avoid robotic or repetitive language
7. Ask follow-up questions to engage the user
8. If context is provided, use it to give specific, accurate answers
9. If no context is found, provide general information about ShoreAgents and ask what they'd like to know
10. Pay attention to user interests and preferences - if they show interest in specific areas, suggest related services
11. Use the detected interests to provide more relevant and personalized recommendations

You can also render components in your responses using special tags like:
- [SERVICE_CARD:service_name] for service information
- [TEAM_MEMBER:name] for team member details
- [CASE_STUDY:title] for case studies
- [PRICING:service] for pricing information
- [CONTACT_FORM:service] for contact forms`;

    const userPrompt = `User message: ${message}

Previous conversation context:
${conversationHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Please provide a helpful response based on the context and your knowledge of ShoreAgents.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    
    if (content.type === 'text') {
      // Parse the response for component tags and generate components
      const { processedContent, components } = await parseResponseForComponents(content.text);
      
      return NextResponse.json({
        content: processedContent,
        components: components,
      });
    }

    return NextResponse.json({
      content: 'I apologize, but I encountered an error processing your request.',
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

async function parseResponseForComponents(text: string) {
  const components: any[] = [];
  let processedContent = text;

  // Parse service card components
  const serviceCardRegex = /\[SERVICE_CARD:([^\]]+)\]/g;
  processedContent = processedContent.replace(serviceCardRegex, (match, serviceName) => {
    const componentId = `service-${Date.now()}-${Math.random()}`;
    components.push({
      type: 'service_card',
      id: componentId,
      serviceName: serviceName
    });
    return '';
  });

  // Parse team member components
  const teamMemberRegex = /\[TEAM_MEMBER:([^\]]+)\]/g;
  processedContent = processedContent.replace(teamMemberRegex, (match, memberName) => {
    const componentId = `team-${Date.now()}-${Math.random()}`;
    components.push({
      type: 'team_member',
      id: componentId,
      memberName: memberName
    });
    return '';
  });

  // Parse case study components
  const caseStudyRegex = /\[CASE_STUDY:([^\]]+)\]/g;
  processedContent = processedContent.replace(caseStudyRegex, (match, caseStudyTitle) => {
    const componentId = `case-${Date.now()}-${Math.random()}`;
    components.push({
      type: 'case_study',
      id: componentId,
      title: caseStudyTitle
    });
    return '';
  });

  // Parse pricing components
  const pricingRegex = /\[PRICING:([^\]]+)\]/g;
  processedContent = processedContent.replace(pricingRegex, (match, service) => {
    const componentId = `pricing-${Date.now()}-${Math.random()}`;
    components.push({
      type: 'pricing',
      id: componentId,
      service: service
    });
    return '';
  });

  // Parse contact form components
  const contactFormRegex = /\[CONTACT_FORM:([^\]]+)\]/g;
  processedContent = processedContent.replace(contactFormRegex, (match, service) => {
    const componentId = `contact-${Date.now()}-${Math.random()}`;
    components.push({
      type: 'contact_form',
      id: componentId,
      service: service
    });
    return '';
  });

  return { processedContent, components };
}
