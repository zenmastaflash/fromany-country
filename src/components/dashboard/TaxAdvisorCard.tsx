// src/components/dashboard/TaxAdvisorCard.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TaxAnalysisResult {
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

export default function TaxAdvisorCard() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TaxAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTaxAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tax-advisor', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
      });
      
      if (!response.ok) throw new Error('Failed to get tax analysis');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Tax Advisor</span>
          <Button 
            variant="primary" 
            onClick={runTaxAnalysis}
            disabled={loading}
            className="ml-auto"
          >
            {loading ? 'Analyzing...' : 'Analyze My Tax Situation'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add tax advice disclaimer */}
        <div className="mb-4 p-3 bg-secondary-dark rounded text-sm">
          <p className="font-semibold mb-1">Tax Advice Disclaimer:</p>
          <p>This AI-powered analysis is for informational and planning purposes only. Always consult with a qualified tax professional for advice specific to your situation.</p>
        </div>
        
        {error && (
          <div className="p-4 mb-4 text-accent bg-secondary-dark rounded">
            <p>{error}</p>
          </div>
        )}
        
        {!results && !loading && !error && (
          <div className="text-center p-6">
            <p className="text-link">Get personalized tax insights based on your travel history</p>
          </div>
        )}
        
        {results && (
          <div className="space-y-6">
            {/* Score display */}
            <div>
              <h3 className="font-bold mb-4">Tax Optimization Score</h3>
              <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${
                    results.tax_optimization_score > 60 ? 'bg-primary' : 
                    results.tax_optimization_score > 30 ? 'bg-accent' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${results.tax_optimization_score}%` }}
                />
              </div>
              <p className="mt-2 text-link">{results.tax_optimization_score}/100</p>
            </div>
            
            {/* AI Insights */}
            <div>
              <h3 className="font-bold mb-4">AI Insights</h3>
              <p className="text-text">{results.ai_insights}</p>
            </div>
            
            {/* Top Recommendation (showing just the most important one) */}
            {results.recommendations.length > 0 && (
              <div>
                <h3 className="font-bold mb-4">Key Recommendation</h3>
                <Card className="p-4">
                  <div className="flex items-center mb-2">
                    <span 
                      className={`w-3 h-3 rounded-full mr-2 ${
                        results.recommendations[0].type === 'warning' ? 'bg-accent' : 
                        results.recommendations[0].type === 'opportunity' ? 'bg-primary' : 
                        'bg-link'
                      }`} 
                    />
                    <h4 className="font-bold">{results.recommendations[0].title}</h4>
                  </div>
                  <p className="text-text mb-3">{results.recommendations[0].description}</p>
                </Card>
              </div>
            )}
            
            {/* Button to view more details */}
            <div className="text-center">
              <Button variant="ghost">
                View Full Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
