import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/progress';
import { ResidencyStatus } from '@prisma/client';

interface CountryStatus {
  country: string;
  daysPresent: number;
  threshold: number;
  lastEntry: string;
  residencyStatus: ResidencyStatus | null;
  documentBased: boolean;
}

export default function TaxLiabilityCard({ 
  currentLocation,
  countryStatuses 
}: { 
  currentLocation: { 
    country: string;
    entryDate: string;
    timezone: string;
  };
  countryStatuses: CountryStatus[];
}) {
  const getThresholdColor = (days: number, threshold: number) => {
    const percentage = (days / threshold) * 100;
    if (percentage < 60) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Liability Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Current Location</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-link">Country</p>
                <p className="font-medium">{currentLocation.country}</p>
              </div>
              <div>
                <p className="text-link">Local Time</p>
                <p className="font-medium">{currentLocation.timezone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-link">Present Since</p>
                <p className="font-medium">{new Date(currentLocation.entryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Tax Liability Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Day Counts</h3>
            <div className="space-y-3">
              {countryStatuses.map((status) => (
                <div key={status.country} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{status.country}</span>
                    <div className="flex items-center gap-2">
                      {status.residencyStatus && (
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          status.documentBased ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status.residencyStatus.replace('_', ' ')}
                        </span>
                      )}
                      <span>{status.daysPresent} / {status.threshold} days</span>
                    </div>
                  </div>
                  <Progress 
                    value={(status.daysPresent / status.threshold) * 100} 
                    className={getThresholdColor(status.daysPresent, status.threshold)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
