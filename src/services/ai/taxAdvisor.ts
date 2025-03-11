// src/services/ai/taxAdvisor.ts
import OpenAI from 'openai';
import { TaxRisk } from '@/lib/tax-utils';

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

export interface DocumentEntry {
  type: string;
  status: string;
  country: string;
  expiryDate?: string;
  issuingCountry: string;
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
  documents?: DocumentEntry[];
}

export interface TaxRule {
  country_code: string;
  name: string;
  residency_threshold: number | null;
  special_rules: any;
  tax_year_start?: string;
  tax_treaties?: any;
}

export interface CalculatedTaxData {
  taxRisks: TaxRisk[];
  documentsByCountry: Record<string, DocumentEntry[]>;
  dateRangeDescription: string;
}

export interface AnalysisResult {
  residency_risks: Array<{
    country_code: string;
    country_name: string;
    days_present: number;
    threshold: number;
    remaining_days: number;
    risk_level: string;
    document_status?: string;
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
 * Analyzes user tax situation using pre-calculated values from tax-utils
 * and generates insights using OpenAI's GPT model
 */
export async function analyzeTaxSituation(
  userData: UserData,
  taxRules: TaxRule[],
  calculatedData: CalculatedTaxData
): Promise<AnalysisResult> {
  try {
    // Create a prompt that includes pre-calculated values
    const prompt = `
You are an expert tax advisor for digital nomads and global travelers. 
I'm providing you with pre-calculated tax analysis data. DO NOT recalculate these values.
Instead, focus on providing insights, recommendations, and explanations based on the given information.

DATE RANGE: ${calculatedData.dateRangeDescription}

PRE-CALCULATED TAX RISKS (DO NOT RECALCULATE):
${JSON.stringify(calculatedData.taxRisks, null, 2)}

USER DOCUMENTS BY COUNTRY:
${JSON.stringify(calculatedData.documentsByCountry, null, 2)}

USER TRAVEL HISTORY (for reference only):
${JSON.stringify(userData.travel_history, null, 2)}

TAX RULES BY COUNTRY (for reference only):
${JSON.stringify(taxRules, null, 2)}

IMPORTANT NOTES ABOUT THE PRE-CALCULATED DATA:
* The "risk" field indicates the current risk level already calculated correctly.
* For countries with RESIDENCY_PERMIT documents, the risk is about NOT spending ENOUGH days.
* For countries without residency documents, the risk is about spending TOO MANY days.
* The "days" value is the accurate count of days spent in each country.
* "documentBased" indicates if calculations considered valid residency documents.
* "daysNeeded" is how many more days are needed (for residency permits) or how many days until threshold is hit.

Based on this pre-calculated data, please provide:
1. Interpretation of residency risks for each country
2. Recommendations tailored to each country's situation
3. An overall tax optimization score (0-100) based on the data
4. Concise, action-oriented insights for the user

Format your response as a valid JSON with the following structure:
{
  "residency_risks": [
    {
      "country_code": string,
      "country_name": string,
      "days_present": number,
      "threshold": number,
      "remaining_days": number, 
      "risk_level": "high" | "medium" | "low",
      "document_status": string // e.g., "Valid residency permit until 2025-06-30" or "No valid documents found"
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

    // Call OpenAI API with the enhanced prompt
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const analysisResult = JSON.parse(responseText) as AnalysisResult;
    
    return analysisResult;
  } catch (error) {
    console.error('Error in AI tax analysis:', error);
    
    // Fallback to basic analysis using pre-calculated data
    return generateFallbackAnalysis(calculatedData);
  }
}

/**
 * Generates a basic analysis when OpenAI fails, using pre-calculated data
 */
function generateFallbackAnalysis(calculatedData: CalculatedTaxData): AnalysisResult {
  const residencyRisks = calculatedData.taxRisks.map(risk => {
    // Find documents for this country
    const countryDocs = (calculatedData.documentsByCountry[risk.country] || []);
    
    // Create document status message
    let documentStatus = "No valid documents found";
    if (countryDocs.length > 0) {
      const validDocs = countryDocs.filter(d => 
        d.status === 'active' && 
        (!d.expiryDate || new Date(d.expiryDate) > new Date())
      );
      
      if (validDocs.length > 0) {
        const docTypes = [...new Set(validDocs.map(d => d.type))].join(', ');
        const earliestExpiry = validDocs
          .filter(d => d.expiryDate)
          .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())[0];
        
        documentStatus = earliestExpiry 
          ? `Valid ${docTypes} until ${earliestExpiry.expiryDate}` 
          : `Valid ${docTypes}`;
      }
    }
    
    // Calculate remaining days appropriately based on residency status
    let remainingDays = 0;
    if (risk.documentBased && risk.daysNeeded !== undefined) {
      remainingDays = risk.daysNeeded;
    } else {
      remainingDays = risk.threshold ? risk.threshold - risk.days : 0;
    }
    
    return {
      country_code: risk.country,
      country_name: risk.country, // Would be better with full country names
      days_present: risk.days,
      threshold: risk.threshold || 183,
      remaining_days: remainingDays,
      risk_level: risk.risk,
      document_status: documentStatus
    };
  });
  
  // Generate recommendations based on risk levels
  const recommendations = [];
  
  // Check for high-risk countries
  const highRiskCountries = residencyRisks.filter(risk => risk.risk_level === 'high');
  if (highRiskCountries.length > 0) {
    // For residency permit countries (need more days)
    const residencyPermitCountries = highRiskCountries.filter(c => 
      c.document_status.includes('RESIDENCY_PERMIT') || 
      c.document_status.includes('residency permit')
    );
    
    if (residencyPermitCountries.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Residency Requirements Not Met',
        description: `You need more days in: ${residencyPermitCountries.map(c => c.country_name).join(', ')} to maintain residency status`,
        actions: ['Plan additional time in these countries', 'Check specific residency requirements']
      });
    }
    
    // For tourist/non-resident countries (too many days)
    const tooManyDaysCountries = highRiskCountries.filter(c => 
      !c.document_status.includes('RESIDENCY_PERMIT') && 
      !c.document_status.includes('residency permit')
    );
    
    if (tooManyDaysCountries.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Tax Residency Risk',
        description: `You're approaching tax residency thresholds in: ${tooManyDaysCountries.map(c => c.country_name).join(', ')}`,
        actions: ['Consider reducing time in these countries', 'Consult with a tax professional']
      });
    }
  }
  
  // Default recommendation if none generated
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      title: 'No Immediate Tax Concerns',
      description: 'Based on your current travel patterns and documentation, you don\'t appear to be at risk.',
      actions: ['Continue to monitor your travel days', 'Keep documents and travel history up to date']
    });
  }
  
  // Calculate a tax optimization score
  const highRiskCount = residencyRisks.filter(risk => risk.risk_level === 'high').length;
  const mediumRiskCount = residencyRisks.filter(risk => risk.risk_level === 'medium').length;
  
  let score = 100;
  score -= highRiskCount * 20;
  score -= mediumRiskCount * 10;
  
  // Bonus for having proper documentation
  const documentedCountries = Object.keys(calculatedData.documentsByCountry).length;
  if (documentedCountries > 0) {
    score += Math.min(documentedCountries * 5, 15);
  }
  
  const taxOptimizationScore = Math.max(0, Math.min(100, score));
  
  return {
    residency_risks: residencyRisks,
    recommendations: recommendations,
    tax_optimization_score: taxOptimizationScore,
    ai_insights: "This analysis is based on your travel patterns and document status. The calculations reflect your current tax situation across countries. For personalized advice, consult a tax professional."
  };
}
