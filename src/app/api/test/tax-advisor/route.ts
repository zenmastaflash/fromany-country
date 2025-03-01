// src/app/api/test/tax-advisor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define TypeScript interfaces
interface TravelEntry {
  country: string;
  entry_date: string;
  exit_date: string | null;
  city?: string;
}

interface UserData {
  userId: string;
  citizenship?: string;
  travel_history: TravelEntry[];
  income_sources?: {
    type: string;
    country: string;
    annual_amount: number;
  }[];
}

interface TaxRule {
  country_code: string;
  name: string;
  residency_threshold: number;
  special_rules: string | Record<string, any>;
}

interface ResidencyRisk {
  country_code: string;
  country_name: string;
  days_present: number;
  threshold: number;
  remaining_days: number;
  risk_level: string;
}

// Mock function to simulate AI analysis
function simulateAIAnalysis(userData: UserData, taxRules: TaxRule[]) {
  // This would be replaced by actual AI service call
  const travelDaysByCountry = userData.travel_history.reduce((acc: Record<string, number>, trip) => {
    const countryCode = trip.country;
    const startDate = new Date(trip.entry_date);
    const endDate = trip.exit_date ? new Date(trip.exit_date) : new Date();
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    acc[countryCode] = (acc[countryCode] || 0) + dayCount;
    return acc;
  }, {});
  
  // Identify countries approaching tax residency
  const residencyRisks = Object.entries(travelDaysByCountry).map(([countryCode, days]) => {
    const countryRule = taxRules.find(rule => rule.country_code === countryCode);
    if (!countryRule) return null;
    
    const threshold = countryRule.residency_threshold;
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
  }).filter(Boolean);
  
  // Generate tax optimization recommendations
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
  
  // Check for countries with favorable tax treatment
  const favorableTaxCountries = taxRules
    .filter(rule => {
      const specialRules = typeof rule.special_rules === 'string' 
        ? JSON.parse(rule.special_rules) 
        : rule.special_rules;
      return specialRules && 
        (specialRules.tax_exemption || 
         specialRules.no_income_tax || 
         specialRules.territorial_taxation);
    })
    .map(rule => rule.name);
  
  if (favorableTaxCountries.length > 0) {
    recommendations.push({
      type: 'opportunity',
      title: 'Tax Optimization Opportunities',
      description: `Consider spending more time in countries with favorable tax treatment: ${favorableTaxCountries.slice(0, 3).join(', ')}`,
      actions: ['Research digital nomad visas in these countries', 'Consult with a tax professional before relocating']
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
  
  return {
    residency_risks: residencyRisks,
    recommendations: recommendations,
    tax_optimization_score: calculateTaxOptimizationScore(residencyRisks, userData),
    // Mockup of what an actual AI response would have
    ai_insights: "Based on your travel patterns, you're spending significant time in high-tax jurisdictions while maintaining tax residency in your home country. Consider restructuring your travel plans to optimize tax efficiency while ensuring compliance with all applicable laws."
  };
}

// Helper function to calculate a tax optimization score
function calculateTaxOptimizationScore(residencyRisks: ResidencyRisk[], userData: UserData) {
  const highRiskCount = residencyRisks.filter(risk => risk.risk_level === 'high').length;
  const mediumRiskCount = residencyRisks.filter(risk => risk.risk_level === 'medium').length;
  
  // Score from 0-100, where higher is better
  let score = 100;
  score -= highRiskCount * 20;
  score -= mediumRiskCount * 10;
  
  // Penalize frequent border crossings
  const borderCrossings = userData.travel_history.length;
  score -= Math.min(borderCrossings * 2, 20);
  
  return Math.max(0, Math.min(100, score));
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, travel_history } = data;
    
    // Get tax rules from database
    let taxRules = [];
    try {
      const countries = travel_history.map(entry => entry.country);
      taxRules = await prisma.country_tax_rules.findMany({
        where: { country_code: { in: countries } }
      });
    } catch (error) {
      console.error('Database error:', error);
      // Fallback to mock data for testing
      taxRules = [
        {
          country_code: 'PT', 
          name: 'Portugal', 
          residency_threshold: 183,
          special_rules: JSON.stringify({
            digital_nomad_visa: true,
            income_requirement: "€3,480 monthly minimum",
            tax_exemption: "50% tax reduction on professional income"
          })
        },
        {
          country_code: 'ES', 
          name: 'Spain', 
          residency_threshold: 183,
          special_rules: JSON.stringify({
            digital_nomad_visa: true,
            income_requirement: "€2,334 monthly minimum",
            tax_rate: "Non-resident income tax rate of 24%"
          })
        },
        {
          country_code: 'TH', 
          name: 'Thailand', 
          residency_threshold: 180,
          special_rules: JSON.stringify({
            digital_nomad_visa: true,
            tax_exemption: "No taxation on foreign income for non-residents"
          })
        }
      ];
    }
    
    // Perform AI analysis (simulated for now)
    const analysisResults = simulateAIAnalysis(data, taxRules);
    
    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error('Error in tax-advisor API:', error);
    return NextResponse.json(
      { error: 'Failed to process tax analysis' },
      { status: 500 }
    );
  }
}
