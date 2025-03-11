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
func
