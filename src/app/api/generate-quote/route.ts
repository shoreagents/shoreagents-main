import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMarketConfig, isNightShiftForPhilippines, applyNightShiftDifferential } from '../../../lib/market-intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Pricing tables from Shore Agents Final Pricing Structure
const SETUP_FEES = {
  'Work from Home': {
    AUD: 1650, USD: 1100, GBP: 850, CAD: 1450, NZD: 1750, EUR: 1050
  },
  'Hybrid': {
    AUD: 1250, USD: 850, GBP: 650, CAD: 1100, NZD: 1350, EUR: 800
  },
  'Full Office': {
    AUD: 850, USD: 550, GBP: 450, CAD: 750, NZD: 900, EUR: 550
  }
};

const WORKSPACE_FEES = {
  'Work from Home': {
    AUD: 200, USD: 150, GBP: 120, CAD: 200, NZD: 230, EUR: 140
  },
  'Hybrid': {
    AUD: 300, USD: 220, GBP: 170, CAD: 300, NZD: 340, EUR: 210
  },
  'Full Office': {
    AUD: 400, USD: 290, GBP: 230, CAD: 400, NZD: 450, EUR: 280
  }
};

const OFFICE_SPACE_FEES = {
  '40m2': {
    AUD: 2100, USD: 1600, GBP: 1200, CAD: 2100, NZD: 2400, EUR: 1500
  },
  '60m2': {
    AUD: 3200, USD: 2300, GBP: 1800, CAD: 3200, NZD: 3600, EUR: 2200
  },
  '100m2': {
    AUD: 5300, USD: 3800, GBP: 3000, CAD: 5300, NZD: 5900, EUR: 3600
  },
  '200m2': {
    AUD: 10500, USD: 7600, GBP: 5900, CAD: 10500, NZD: 11800, EUR: 7200
  }
};

// Salary multipliers
const MULTIPLIERS = {
  entry: 1.7,   // ₱20k-39k
  mid: 1.5,     // ₱40k-99k
  senior: 1.4   // ₱100k+
};

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

async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    // Try primary exchange rate API
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY}/pair/${fromCurrency}/${toCurrency}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.conversion_rate) {
        return data.conversion_rate;
      }
    }
    
    // Fallback to free API
    const fallbackResponse = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      return fallbackData.rates[toCurrency] || 0.018;
    }
    
    throw new Error('Both exchange rate APIs failed');
    
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    // Static fallback rates (updated as of 2024)
    const fallbackRates: {[key: string]: number} = {
      'PHP_USD': 0.018,
      'PHP_AUD': 0.027,
      'PHP_GBP': 0.014,
      'PHP_CAD': 0.024,
      'PHP_NZD': 0.029,
      'PHP_EUR': 0.017
    };
    return fallbackRates[`${fromCurrency}_${toCurrency}`] || 0.018;
  }
}

function getCurrencySymbol(currency: string): string {
  const symbols: {[key: string]: string} = {
    'USD': '$',
    'AUD': '$',
    'GBP': '£',
    'CAD': '$',
    'NZD': '$',
    'EUR': '€'
  };
  return symbols[currency] || '$';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      roles,
      roleCount,
      industry,
      rolesSalaryData,
      setupSelections,
      bulkSetup,
      officeSpaceSelected,
      officeSize,
      currency,
      userLocation
    } = body;
    
    // Get market configuration for night shift differential
    const marketConfig = getMarketConfig(userLocation?.countryCode || 'US');
    const isNightShift = isNightShiftForPhilippines(marketConfig);
    
    console.log(`Market: ${marketConfig.country}, Night Shift: ${isNightShift}, Differential: ${marketConfig.nightShiftDifferential}%`);

    const quoteRoles = [];
    let totalMonthlyCost = 0;
    let totalSetupCost = 0;

    // Get exchange rate from PHP to user currency
    const exchangeRate = await getExchangeRate('PHP', currency);

    // Process each role
    for (let i = 0; i < roleCount; i++) {
      const role = roles[Math.min(i, roles.length - 1)]; // Handle "all same role" case
      
      // Get pre-calculated salary data
      const salaryData = rolesSalaryData[role.id];
      if (!salaryData) {
        throw new Error(`No salary data found for role: ${role.title}`);
      }
      
      // Apply multiplier
      const multiplier = MULTIPLIERS[salaryData.level as keyof typeof MULTIPLIERS];
      let totalSalaryPHP = salaryData.salary * multiplier;
      
      // Apply night shift differential if applicable
      if (isNightShift) {
        totalSalaryPHP = applyNightShiftDifferential(totalSalaryPHP, marketConfig, true);
        console.log(`Night shift differential applied: ${marketConfig.nightShiftDifferential}% for ${role.title}`);
      }
      
      // Convert salary to user currency
      const monthlySalaryCost = Math.round(totalSalaryPHP * exchangeRate);
      
      // Determine setup type
      let workspaceType = '';
      if (bulkSetup) {
        if (bulkSetup === 'Office Space') {
          workspaceType = 'Office Space';
        } else {
          workspaceType = bulkSetup.replace('All ', '');
        }
      } else {
        workspaceType = setupSelections[i] || 'Work from Home';
      }
      
      // Calculate fees
      let setupFee = 0;
      let workspaceFee = 0;
      
      if (workspaceType === 'Office Space' && officeSize) {
        // Office space: only multiplier cost, no workspace fee
        setupFee = 0; // Setup included in office space
        workspaceFee = 0; // No individual workspace fee for office space
      } else {
        setupFee = SETUP_FEES[workspaceType as keyof typeof SETUP_FEES]?.[currency as keyof typeof SETUP_FEES['Work from Home']] || 0;
        workspaceFee = WORKSPACE_FEES[workspaceType as keyof typeof WORKSPACE_FEES]?.[currency as keyof typeof WORKSPACE_FEES['Work from Home']] || 0;
      }
      
      const totalMonthlyCostForRole = monthlySalaryCost + workspaceFee;
      
      quoteRoles.push({
        title: role.title,
        monthlyCost: totalMonthlyCostForRole,
        setupFee: setupFee,
        workspaceType: workspaceType
      });
      
      totalMonthlyCost += totalMonthlyCostForRole;
      totalSetupCost += setupFee;
    }
    
    // Add office space cost if selected
    if (bulkSetup === 'Office Space' && officeSize) {
      const officeCost = OFFICE_SPACE_FEES[officeSize as keyof typeof OFFICE_SPACE_FEES]?.[currency as keyof typeof OFFICE_SPACE_FEES['40m2']] || 0;
      totalMonthlyCost += officeCost;
      
      // Add office space as separate line item
      quoteRoles.push({
        title: `${officeSize.replace('m2', 'm²')} Office Space`,
        monthlyCost: officeCost,
        setupFee: 0,
        workspaceType: 'Office Space'
      });
    }

    const quote = {
      roles: quoteRoles,
      totalMonthlyCost,
      totalSetupCost,
      currency,
      currencySymbol: getCurrencySymbol(currency)
    };

    return NextResponse.json(quote);
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
