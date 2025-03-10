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
 * Analyzes user travel data for tax implications using OpenAI's GPT model
 */
export async function analyzeTaxSituation(
  userData: UserData,
  taxRules: TaxRule[]
): Promise<AnalysisResult> {
  try {
    // Create a more comprehensive prompt that includes document information
    const prompt = `
You are an expert tax advisor for digital nomads and global travelers. 
Based on the following user data and tax rules, please analyze the tax implications, risks, and opportunities.

USER TRAVEL HISTORY:
${JSON.stringify(userData.travel_history, null, 2)}

USER DOCUMENTS:
${JSON.stringify(userData.documents || [], null, 2)}

TAX RULES BY COUNTRY:
${JSON.stringify(taxRules, null, 2)}

CRITICAL INSTRUCTIONS ABOUT RESIDENCY PERMITS:
* RESIDENCY_PERMIT documents mean the user is REQUIRED to spend a minimum time in that country
* For countries where the user has a RESIDENCY_PERMIT, THE RISK IS NOT SPENDING ENOUGH DAYS
* This is the OPPOSITE of regular tourist visits where the risk is spending too many days
* In the Netherlands, for example, a residency permit typically requires spending AT LEAST 183 days per year
* If a user has a RESIDENCY_PERMIT, DO NOT advise them to reduce their days in that country
* Instead, warn if they haven't stayed enough days to maintain their residency status

Other important considerations:
* For countries WITHOUT residency documents, normal tax residency thresholds apply (risk of staying too many days)
* VISA documents may modify tax obligations or create specific requirements
* Pay careful attention to document expiry dates and advise on renewal if needed
* Consider if the user has documents from multiple countries and potential conflicts

Please provide the following:
1. Calculate days present in each country and identify residency risks, taking into account document status
2. Provide specific recommendations to optimize tax situations based on current documents
3. Rate the overall tax optimization on a scale of 0-100
4. Provide concise, actionable insights that consider both travel patterns and document status

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
    
    // Fallback to basic analysis for robustness
    return fallbackAnalysis(userData, taxRules);
  }
}

/**
 * Enhanced fallback function that considers documents
 */
function fallbackAnalysis(userData: UserData, taxRules: TaxRule[]): AnalysisResult {
  // First, convert travel entries to CountryStay format
  const stays = userData.travel_history.map(travel => ({
    startDate: new Date(travel.entry_date),
    endDate: travel.exit_date ? new Date(travel.exit_date) : undefined,
    country: travel.country
  }));
  
  // Create a map of country codes to day counts using the proper calculation
  const countryDays: Record<string, number> = {};
  const currentDate = new Date();
  
  // Get unique countries
  const uniqueCountries = [...new Set(stays.map(stay => stay.country))];
  
  // Use the same calculation logic as in tax-utils.ts
  uniqueCountries.forEach(country => {
    const countryStays = stays.filter(stay => stay.country === country);
    let totalDays = 0;
    
    // Sort stays by start date
    const sortedStays = [...countryStays].sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );
    
    // Track days we've already counted to avoid double counting
    const countedDays = new Set<string>();
    
    sortedStays.forEach(stay => {
      let start = new Date(stay.startDate);
      let end = stay.endDate && stay.endDate < currentDate ? 
          new Date(stay.endDate) : new Date();
      
      // Don't count future days
      if (end > currentDate) end = currentDate;
      
      if (start > end) return;
      
      // Count each day once
      let current = new Date(start);
      while (current <= end) {
        const dateKey = current.toISOString().split('T')[0]; // YYYY-MM-DD format
        if (!countedDays.has(dateKey)) {
          countedDays.add(dateKey);
          totalDays++;
        }
        
        // Move to next day
        current.setDate(current.getDate() + 1);
      }
    });
    
    countryDays[country] = totalDays;
  });
  
  // Group documents by country
  const documentsByCountry: Record<string, DocumentEntry[]> = {};
  
  if (userData.documents && userData.documents.length > 0) {
    userData.documents.forEach(doc => {
      const country = doc.issuingCountry;
      if (!documentsByCountry[country]) {
        documentsByCountry[country] = [];
      }
      documentsByCountry[country].push(doc);
    });
  }
  
  // Identify countries approaching tax residency
  const residencyRisks = Object.entries(countryDays)
    .map(([countryCode, days]) => {
      const countryRule = taxRules.find(rule => rule.country_code === countryCode);
      if (!countryRule) return null;
      
      const threshold = countryRule.residency_threshold ?? 183;
      const remainingDays = threshold - days;
      
      // Check if user has documents for this country
      const countryDocs = documentsByCountry[countryCode] || [];
      const hasResidencyPermit = countryDocs.some(d => 
        d.type === 'RESIDENCY_PERMIT' && 
        d.status === 'active' && 
        (!d.expiryDate || new Date(d.expiryDate) > new Date())
      );
      
      // Determine risk level based on documents and days
      let riskLevel = 'low';
      if (hasResidencyPermit) {
        // For residency permits, risk is high if not spending enough time
        riskLevel = remainingDays > threshold * 0.5 ? 'high' :
                    remainingDays > threshold * 0.25 ? 'medium' : 'low';
      } else {
        // For standard tax residency concerns, risk is high if approaching threshold
        riskLevel = remainingDays < 30 ? 'high' :
                    remainingDays < 60 ? 'medium' : 'low';
      }
      
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
      
      return {
        country_code: countryCode,
        country_name: countryRule.name,
        days_present: days,
        threshold: threshold,
        remaining_days: remainingDays,
        risk_level: riskLevel,
        document_status: documentStatus
      };
    })
    .filter((risk): risk is NonNullable<typeof risk> => risk !== null);
  
  // Generate recommendations based on documents and travel patterns
  const recommendations = [];
  
  // Check for high-risk countries
  const highRiskCountries = residencyRisks.filter(risk => risk.risk_level === 'high');
  if (highRiskCountries.length > 0) {
    const docsNeeded = highRiskCountries.filter(c => c.document_status === "No valid documents found");
    const residencyNotMet = highRiskCountries.filter(c => c.document_status.includes("RESIDENCY_PERMIT"));
    
    if (docsNeeded.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Documentation Needed',
        description: `You may need residency documentation for: ${docsNeeded.map(c => c.country_name).join(', ')}`,
        actions: ['Consider applying for appropriate visas or residency permits', 'Consult with a tax professional']
      });
    }
    
    if (residencyNotMet.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Residency Requirements Not Met',
        description: `You need more days in: ${residencyNotMet.map(c => c.country_name).join(', ')} to maintain residency status`,
        actions: ['Plan additional time in these countries', 'Check specific residency requirements']
      });
    }
  }
  
  // Check for expiring documents
  if (userData.documents) {
    const now = new Date();
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(now.getMonth() + 3);
    
    const expiringDocs = userData.documents.filter(doc => 
      doc.expiryDate && 
      new Date(doc.expiryDate) > now && 
      new Date(doc.expiryDate) < threeMonthsLater
    );
    
    if (expiringDocs.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Documents Expiring Soon',
        description: `You have ${expiringDocs.length} document(s) expiring in the next 3 months`,
        actions: ['Begin renewal process', 'Check renewal requirements for each country']
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
  const documentedCountries = Object.keys(documentsByCountry).length;
  
  let score = 100;
  score -= highRiskCount * 20;
  score -= mediumRiskCount * 10;
  
  // Bonus for having proper documentation
  if (documentedCountries > 0) {
    score += Math.min(documentedCountries * 5, 15);
  }
  
  const taxOptimizationScore = Math.max(0, Math.min(100, score));
  
  return {
    residency_risks: residencyRisks,
    recommendations: recommendations,
    tax_optimization_score: taxOptimizationScore,
    ai_insights: "This analysis considers both your travel patterns and document status. Keep your documents updated and ensure you meet residency requirements where applicable."
  };
}
