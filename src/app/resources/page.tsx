'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const resources = {
  compliance: [
    {
      title: 'Digital Nomad Visas',
      description: 'Comprehensive guide to countries offering digital nomad visas and their requirements.',
      link: '#'
    },
    {
      title: 'Tax Treaties',
      description: 'Database of international tax treaties and their implications for digital nomads.',
      link: '#'
    },
  ],
  travel: [
    {
      title: 'Country Entry Requirements',
      description: 'Up-to-date information on visa requirements and entry restrictions.',
      link: '#'
    },
    {
      title: 'Travel Insurance',
      description: 'Comparison of travel insurance options for digital nomads.',
      link: '#'
    },
  ],
  business: [
    {
      title: 'Remote Work Policies',
      description: 'Templates and guides for creating remote work policies.',
      link: '#'
    },
    {
      title: 'Banking Solutions',
      description: 'International banking options for digital nomads.',
      link: '#'
    },
  ],
  lifestyle: [
    {
      title: 'Co-living Spaces',
      description: 'Directory of co-living spaces in popular digital nomad destinations.',
      link: '#'
    },
    {
      title: 'Remote Work Tools',
      description: 'Curated list of tools and software for remote work.',
      link: '#'
    },
  ]
};

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Resources</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {Object.entries(resources).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.title} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="text-lg font-medium text-indigo-600">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}