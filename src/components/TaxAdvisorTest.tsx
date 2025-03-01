// src/components/TaxAdvisorTest.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

export default function TaxAdvisorTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Example travel history data
  const exampleData = {
    userId: 'test-user-1',
    citizenship: 'US',
    travel_history: [
      { 
        country: 'PT', 
        entry_date: '2024-01-01', 
        exit_date: '2024-03-15',
        city: 'Lisbon' 
      },
      { 
        country: 'ES', 
        entry_date: '2024-03-15', 
        exit_date: '2024-05-30',
        city: 'Barcelona' 
      },
      { 
        country: 'TH', 
        entry_date: '2024-05-30', 
        exit_date: '2024-08-15',
        city: 'Bangkok' 
      },
      { 
        country: 'PT', 
        entry_date: '2024-08-15', 
        exit_date: null, // Currently here
        city: 'Porto' 
      }
    ],
    income_sources: [
      {
        type: 'remote_employment',
        country: 'US',
        annual_amount: 95000
      }
    ]
  };

  const runTaxAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/test/tax-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exampleData),
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
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-text">AI Tax Advisor Test</h2>
        <p className="text-link">Test the AI tax recommendation system using sample travel data</p>
      </div>
      
      <Card className="p-4">
        <h3 className="font-bold mb-2">Sample Data</h3>
        <div className="max-h-60 overflow-auto rounded bg-secondary-dark p-2 text-sm mb-4">
          <pre className="text-text">{JSON.stringify(exampleData, null, 2)}</pre>
        </div>
        
        <Button 
          variant="primary" 
          onClick={runTaxAnalysis}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Run Tax Analysis'}
        </Button>
      </Card>
      
      {error && (
        <Card className="p-4 border-accent">
          <p className="text-accent">{error}</p>
        </Card>
      )}
      
      {results && (
        <div className="space-y-4">
          <Card className="p-4">
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
          </Card>
          
          <Card className="p-4">
            <h3 className="font-bold mb-4">AI Insights</h3>
            <p className="text-text">{results.ai_insights}</p>
          </Card>
          
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
    </div>
  );
}
