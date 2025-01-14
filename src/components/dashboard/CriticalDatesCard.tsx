import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, AlertTriangle } from 'lucide-react';

interface CriticalDate {
  type: 'document' | 'visa' | 'tax' | 'exit';
  title: string;
  date: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
}

export default function CriticalDatesCard({ dates }: { dates: CriticalDate[] }) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Critical Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dates.map((item, index) => (
            <Alert key={index} className={getUrgencyColor(item.urgency)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{item.title}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="flex justify-between items-center">
                  <span>{item.description}</span>
                  <span className="font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
