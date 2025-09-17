import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Simple in-memory cache for autocomplete suggestions
const suggestionCache = new Map<string, { suggestions: unknown[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { query, type, industry, roleTitle, generateAnother, generationCount } = await request.json();

    if (!query || !type) {
      return NextResponse.json(
        { error: 'Query and type are required' },
        { status: 400 }
      );
    }

    // Check cache first (but not for "generate another" requests)
    const cacheKey = generateAnother 
      ? `${type}-${query}-${industry || ''}-${roleTitle || ''}-${Date.now()}` // Unique key for each "generate another"
      : `${type}-${query}-${industry || ''}-${roleTitle || ''}`;
    
    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !generateAnother) {
      return NextResponse.json({ suggestions: cached.suggestions });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'industry') {
      systemPrompt = `You are an AI assistant helping users find the right industry for their business. 
      Based on the user's partial input, suggest relevant industries that match their typing.
      
      Return ONLY a JSON array of industry objects with this exact structure:
      [
        {
          "name": "Industry Name",
          "category": "Category",
          "description": "Brief description of what this industry covers"
        }
      ]
      
      Include 5-8 relevant suggestions. Be specific and helpful.`;

      userPrompt = `User is typing: "${query}"
      
      Suggest industries that match this input. Consider:
      - Exact matches
      - Partial matches
      - Related industries
      - Common industry names
      
      Return only the JSON array, no other text.`;
    } else if (type === 'role') {
      systemPrompt = `You are an AI assistant helping users find the right job roles for their team.
      Based on the user's partial input and industry context, suggest relevant job roles.
      
      Return ONLY a JSON array of role objects with this exact structure:
      [
        {
          "title": "Role Title",
          "description": "Brief description of responsibilities",
          "level": "entry|mid|senior"
        }
      ]
      
      Include 6-10 relevant suggestions. Be specific about the role and its level.`;

      userPrompt = `User is typing: "${query}"
      Industry context: ${industry || 'Not specified'}
      
      Suggest job roles that match this input. Consider:
      - Exact role name matches
      - Partial matches
      - Industry-specific roles
      - Common role variations
      - Appropriate experience levels
      
      Return only the JSON array, no other text.`;
    } else if (type === 'description') {
      systemPrompt = `You are an AI assistant that generates detailed job role descriptions.
      Based on the role title and industry context, create a comprehensive job description.
      
      IMPORTANT: You must return ONLY a valid JSON object with this exact structure:
      {
        "description": "Your detailed job description here"
      }
      
      Do not include any other text, explanations, or formatting outside the JSON object.
      Make the description professional, specific, and comprehensive.`;

      // Create more varied prompts for different generations
      const variationPrompts = [
        `Create a DIFFERENT variation focusing on TECHNICAL SKILLS and SYSTEM EXPERTISE. Emphasize software, tools, and technical competencies.`,
        `Create a DIFFERENT variation focusing on COMMUNICATION and INTERPERSONAL SKILLS. Emphasize client relations, teamwork, and soft skills.`,
        `Create a DIFFERENT variation focusing on OPERATIONAL and PROCESS MANAGEMENT. Emphasize workflow, efficiency, and organizational skills.`,
        `Create a DIFFERENT variation focusing on ANALYTICAL and PROBLEM-SOLVING SKILLS. Emphasize data analysis, critical thinking, and decision-making.`,
        `Create a DIFFERENT variation focusing on LEADERSHIP and PROJECT MANAGEMENT. Emphasize team leadership, project coordination, and strategic thinking.`,
        `Create a DIFFERENT variation focusing on CREATIVE and INNOVATIVE SKILLS. Emphasize creativity, innovation, and out-of-the-box thinking.`
      ];

      // Use a variation prompt based on generation count for "generate another"
      const randomVariation = generateAnother 
        ? variationPrompts[(generationCount || 0) % variationPrompts.length]
        : '';

      userPrompt = `Generate a detailed job description for the role: "${roleTitle}"
      Industry context: ${industry || 'General business'}
      
      Create a comprehensive description that includes:
      - Primary responsibilities and daily tasks
      - Required skills and qualifications
      - Industry-specific knowledge or experience
      - Expected deliverables and outcomes
      
      ${randomVariation}
      
      IMPORTANT: Use completely different wording, structure, and focus areas. Make this description unique and distinct from any previous versions.
      
      Return ONLY the JSON object with the description field. No other text.`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      temperature: generateAnother ? 0.9 : 0.7, // Higher temperature for more variation
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const aiResponse = response.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the JSON response
    let suggestions;
    try {
      if (type === 'description') {
        // For descriptions, expect a JSON object
        const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          suggestions = parsed.description;
        } else {
          // Fallback: try to extract description from plain text
          const lines = aiResponse.text.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            suggestions = lines.join(' ').trim();
          } else {
            throw new Error('No description found in response');
          }
        }
      } else {
        // For suggestions, expect a JSON array
        const jsonMatch = aiResponse.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.text);
      console.error('Parse error:', parseError);
      
      // For descriptions, provide a fallback
      if (type === 'description') {
        suggestions = `This role involves key responsibilities and tasks related to ${roleTitle || 'the position'}. The ideal candidate should have relevant experience and skills for this position.`;
      } else {
        return NextResponse.json(
          { error: 'Failed to parse suggestions' },
          { status: 500 }
        );
      }
    }

    // Cache the results
    suggestionCache.set(cacheKey, {
      suggestions,
      timestamp: Date.now()
    });

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
