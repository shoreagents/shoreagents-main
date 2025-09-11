import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function estimateSalary(roleTitle: string, description: string, industry: string): Promise<{ salary: number; level: 'entry' | 'mid' | 'senior' }> {
  try {
    const prompt = `You are a Philippine BPO salary expert specializing in offshore staffing rates. Based on the role information below, estimate the monthly salary in Philippine Pesos (₱) and determine the experience level.

CONTEXT: This is for BPO/offshore staffing where we provide Filipino virtual assistants and specialists to international clients.

Role Title: ${roleTitle}
Description: ${description}
Industry: ${industry}

PHILIPPINE BPO SALARY GUIDELINES:
- Entry Level (₱20,000-39,999): Basic admin, data entry, simple customer service, social media posting
- Mid Level (₱40,000-99,999): Specialized skills, team leads, experienced VAs, technical roles, sales
- Senior Level (₱100,000+): Managers, experts, specialized professionals, senior developers

Consider:
- Philippine BPO market rates (not Western salaries)
- Role complexity and required skills
- Industry standards for offshore staffing
- Experience level needed for the described tasks

Respond with ONLY this JSON format:
{
  "salary": 32000,
  "level": "entry"
}`;

    // Retry logic for API overload
    let retries = 3;
    let message;
    
    while (retries > 0) {
      try {
        message = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }]
        });
        break; // Success, exit retry loop
      } catch (apiError: any) {
        retries--;
        if (apiError.status === 529 && retries > 0) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 2000));
          continue;
        }
        throw apiError; // Re-throw if not retryable or out of retries
      }
    }

    const response = message?.content?.[0];
    if (response?.type === 'text') {
      // Clean the response to extract JSON
      const cleanResponse = response.text.trim();
      const jsonMatch = cleanResponse.match(/\{[^}]+\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          salary: result.salary,
          level: result.level
        };
      }
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error estimating salary:', error);
    
    // Enhanced fallback logic based on role keywords
    const titleLower = roleTitle.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Senior level keywords
    if (titleLower.includes('manager') || titleLower.includes('senior') || titleLower.includes('lead') || 
        titleLower.includes('director') || descLower.includes('management') || descLower.includes('strategic')) {
      return { salary: 85000, level: 'senior' };
    }
    
    // Mid level keywords  
    if (titleLower.includes('specialist') || titleLower.includes('coordinator') || titleLower.includes('analyst') ||
        titleLower.includes('marketing') || titleLower.includes('sales') || descLower.includes('experience')) {
      return { salary: 55000, level: 'mid' };
    }
    
    // Default to entry level
    return { salary: 28000, level: 'entry' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleTitle, description, industry } = body;

    if (!roleTitle || !description) {
      return NextResponse.json(
        { error: 'Role title and description are required' },
        { status: 400 }
      );
    }

    const result = await estimateSalary(roleTitle, description, industry || 'General Business');

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in estimate-salary API:', error);
    return NextResponse.json(
      { error: 'Failed to estimate salary' },
      { status: 500 }
    );
  }
}
