import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Geo-Arbitrage Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Benefits of Geo-Arbitrage</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Cost of Living Optimization
                <p className="text-sm text-gray-600 ml-4">Take advantage of currency differences and lower living costs while maintaining or increasing income.</p>
              </li>
              <li>• Quality of Life Improvement
                <p className="text-sm text-gray-600 ml-4">Access to better amenities, healthcare, or lifestyle options in different locations.</p>
              </li>
              <li>• Tax Efficiency
                <p className="text-sm text-gray-600 ml-4">Legal optimization of tax obligations through careful planning of residence status.</p>
              </li>
              <li>• Career Opportunities
                <p className="text-sm text-gray-600 ml-4">Access to global job markets and international business opportunities.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Legal Compliance
                <p className="text-sm text-gray-600 ml-4">Always ensure compliance with visa requirements and local regulations.</p>
              </li>
              <li>• Tax Obligations
                <p className="text-sm text-gray-600 ml-4">Understand tax residency rules and reporting requirements in all relevant jurisdictions.</p>
              </li>
              <li>• Healthcare Access
                <p className="text-sm text-gray-600 ml-4">Consider insurance coverage and healthcare quality in different locations.</p>
              </li>
              <li>• Banking and Finance
                <p className="text-sm text-gray-600 ml-4">Maintain proper financial arrangements and understand currency risks.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Digital Nomad Visas
                <p className="text-sm text-gray-600 ml-4">Current list of countries offering special visas for remote workers.</p>
              </li>
              <li>• Tax Treaties
                <p className="text-sm text-gray-600 ml-4">Database of international tax treaties and agreements.</p>
              </li>
              <li>• Cost Comparisons
                <p className="text-sm text-gray-600 ml-4">Tools for comparing living costs across different cities.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partner Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• International Banking
                <p className="text-sm text-gray-600 ml-4">Trusted partners for international banking solutions.</p>
              </li>
              <li>• Tax Advisors
                <p className="text-sm text-gray-600 ml-4">Network of international tax professionals.</p>
              </li>
              <li>• Immigration Services
                <p className="text-sm text-gray-600 ml-4">Verified immigration consultants and legal services.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}