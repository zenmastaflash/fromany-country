// src/components/dashboard/TaxAdvisorCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

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

export default function TaxAdvisor() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TaxAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTaxAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tax-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // No need to send data as we'll fetch it server-side
      });
      
      if (!response.ok) {
        throw new Error('Failed to get tax analysis');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
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
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Analyzing...
              </>
            ) : (
              'Analyze My Tax Situation'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 text-accent bg-secondary-dark rounded">
            <p>{error}</p>
          </div>
        )}
        
        {!results && !loading && !error && (
          <div className="text-center p-6">
            <p className="text-link">Click the button above to analyze your tax situation based on your travel history.</p>
            <p className="text-link mt-2 text-sm">This AI-powered analysis will identify potential tax residency risks and provide personalized recommendations.</p>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center p-12">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        
        {results && (
          <div className="space-y-6">
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
            
            <div>
              <h3 className="font-bold mb-4">AI Insights</h3>
              <p className="text-text">{results.ai_insights}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Recommendations</h3>
              <div className="space-y-4">
                {results.recommendations.map((rec, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center mb-2">
                      <span 
                        className={`w-3 h-3 rounded-full mr-2 ${
                          rec.type === 'warning' ? 'bg-accent' : 
                          rec.type === 'opportunity' ? 'bg-primary' : 
                          'bg-link'
                        }`} 
                      />
                      <h4 className="font-bold">{rec.title}</h4>
                    </div>
                    <p className="text-text mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.actions.map((action, j) => (
                        <span key={j} className="px-2 py-1 text-xs font-semibold rounded bg-secondary text-text">
                          {action}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Residency Risks</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary-dark">
                      <th className="p-2 text-left text-text">Country</th>
                      <th className="p-2 text-left text-text">Days Present</th>
                      <th className="p-2 text-left text-text">Threshold</th>
                      <th className="p-2 text-left text-text">Remaining</th>
                      <th className="p-2 text-left text-text">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.residency_risks.map((risk, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2 text-text">{risk.country_name}</td>
                        <td className="p-2 text-text">{risk.days_present}</td>
                        <td className="p-2 text-text">{risk.threshold}</td>
                        <td className="p-2 text-text">{risk.remaining_days}</td>
                        <td className="p-2">
                          <span 
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              risk.risk_level === 'high' ? 'bg-accent' : 
                              risk.risk_level === 'medium' ? 'bg-primary' : 
                              'bg-link'
                            } text-text`}
                          >
                            {risk.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
