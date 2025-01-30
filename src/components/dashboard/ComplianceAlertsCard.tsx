import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface ComplianceAlert {
  type: 'tax' | 'visa' | 'entry' | 'exit';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired?: string;
}

export default function ComplianceAlertsCard({ alerts }: { alerts: ComplianceAlert[] }) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default: return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} className={`border-l-4 ${getSeverityStyles(alert.severity)}`}>
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {alert.title}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p>{alert.description}</p>
                {alert.actionRequired && (
                  <p className="mt-2 font-medium">
                    Required Action: {alert.actionRequired}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
