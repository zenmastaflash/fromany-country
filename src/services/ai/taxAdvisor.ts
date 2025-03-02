// src/services/ai/taxAdvisor.ts
import OpenAI from 'openai';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TravelEntry {
  country: string;
  entry_date: string;
  exit_date: string | null;
  city?: string;
  purpose?: string;
}

export interface UserData {
  userId: string;
  citizenship?: string;
  travel_history: TravelEntry[];
  income_sources?: {
    type: string;
    country: string;
    annual_amount: number;
  }[];
}

export interface TaxRule {
  country_code: string;
  name: string;
  residency_threshold: number | null;
  special_rules: any;
  tax_year_start?: string;
  tax_treaties?: any;
}

export interface AnalysisResult {
  residency_risks: Array<{
    country_code: string;
    country_name: string;
    days_present: number;
    threshold: number;
    remaining_days: number;
    risk_level: string;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    actions: string[];
  }>;
  tax_optimization_score: number;
  ai_insights: string;
}

/**
 * Analyzes user travel data for tax implications using OpenAI's GPT model
 */
export async function analyzeTaxSituation(
  userData: UserData,
  taxRules: TaxRule[]
): Promise<AnalysisResult> {
  try {
    // Create a prompt for the AI with necessary context
    const prompt = `
You are an expert tax advisor for digital nomads and global travelers. 
Based on the following travel history and tax rules, please analyze the tax implications, risks, and opportunities.

USER TRAVEL HISTORY:
${JSON.stringify(userData.travel_history, null, 2)}

TAX RULES BY COUNTRY:
${JSON.stringify(taxRules, null, 2)}

Please provide the following:
1. Calculate days present in each country and identify residency risks
2. Provide specific recommendations to optimize tax situations
3. Rate the overall tax optimization on a scale of 0-100
4. Provide concise, actionable insights

Format your response as a valid JSON with the following structure:
{
  "residency_risks": [
    {
      "country_code": string,
      "country_name": string,
      "days_present": number,
      "threshold": number,
      "remaining_days": number, 
      "risk_level": "high" | "medium" | "low"
    }
  ],
  "recommendations": [
    {
      "type": "warning" | "opportunity" | "info",
      "title": string,
      "description": string,
      "actions": string[]
    }
  ],
  "tax_optimization_score": number,
  "ai_insights": string
}
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview', // Use appropriate model
      response_format: { type: 'json_object' },
      temperature: 0.2, // Lower temperature for more factual responses
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const analysisResult = JSON.parse(responseText) as AnalysisResult;
    
    return analysisResult;
  } catch (error) {
    console.error('Error in AI tax analysis:', error);
    
    // Fallback to basic analysis for robustness
    return fallbackAnalysis(userData, taxRules);
  }
}

/**
 * Fallback function if the AI service fails
 */
function fallbackAnalysis(userData: UserData, taxRules: TaxRule[]): AnalysisResult {
  // Calculate days present in each country
  const travelDaysByCountry = userData.travel_history.reduce((acc: Record<string, number>, trip) => {
    const countryCode = trip.country;
    const startDate = new Date(trip.entry_date);
    const endDate = trip.exit_date ? new Date(trip.exit_date) : new Date();
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    acc[countryCode] = (acc[countryCode] || 0) + dayCount;
    return acc;
  }, {});
  
  // Identify countries approaching tax residency
  const residencyRisks = Object.entries(travelDaysByCountry)
    .map(([countryCode, days]) => {
      const countryRule = taxRules.find(rule => rule.country_code === countryCode);
      if (!countryRule) return null;
      
      const threshold = countryRule.residency_threshold ?? 183;
      const remainingDays = threshold - days;
      const riskLevel = remainingDays < 30 ? 'high' : remainingDays < 60 ? 'medium' : 'low';
      
      return {
        country_code: countryCode,
        country_name: countryRule.name,
        days_present: days,
        threshold: threshold,
        remaining_days: remainingDays,
        risk_level: riskLevel
      };
    })
    .filter((risk): risk is NonNullable<typeof risk> => risk !== null);
  
  // Generate recommendations
  const recommendations = [];
  
  // Check for high-risk countries
  const highRiskCountries = residencyRisks.filter(risk => risk.risk_level === 'high');
  if (highRiskCountries.length > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Tax Residency Risk Alert',
      description: `You're approaching tax residency thresholds in: ${highRiskCountries.map(c => c.country_name).join(', ')}`,
      actions: ['Consider leaving these countries temporarily', 'Consult with a tax professional']
    });
  }
  
  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      title: 'No Immediate Tax Concerns',
      description: 'Based on your current travel patterns, you don\'t appear to be at risk of triggering tax residency in any country.',
      actions: ['Continue to monitor your travel days', 'Update your travel history regularly']
    });
  }
  
  // Calculate a basic tax optimization score
  const highRiskCount = residencyRisks.filter(risk => risk.risk_level === 'high').length;
  const mediumRiskCount = residencyRisks.filter(risk => risk.risk_level === 'medium').length;
  
  let score = 100;
  score -= highRiskCount * 20;
  score -= mediumRiskCount * 10;
  
  const taxOptimizationScore = Math.max(0, Math.min(100, score));
  
  return {
    residency_risks: residencyRisks,
    recommendations: recommendations,
    tax_optimization_score: taxOptimizationScore,
    ai_insights: "This is a basic analysis based on day counts. For more detailed insights, please ensure the OpenAI integration is working correctly."
  };
}
