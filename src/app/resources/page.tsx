'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const resources = {
  visas: [
    {
      title: 'Digital Nomad Visa Guide 2024',
      description: 'Complete list of 41 countries offering digital nomad visas with requirements and benefits.',
      link: 'https://www.planet-nomad.com/en/digital-nomad-visa/'
    },
    {
      title: 'Comprehensive Visa List',
      description: '66 countries offering digital nomad visas with detailed requirements and tax implications.',
      link: 'https://citizenremote.com/blog/digital-nomad-visa-countries/'
    },
    {
      title: 'Discovery Sessions Visa Guide',
      description: 'Detailed guide to 24 digital nomad visas, freelancer visas, and e-residency programs.',
      link: 'https://discoverysessions.com/digital-nomad-visas/'
    },
  ],
  tax: [
    {
      title: 'US Nomad Tax Guide',
      description: 'Comprehensive tax guide for US citizens, including strategies to minimize US tax liability.',
      link: 'https://brighttax.com/blog/digital-nomad-taxes-a-complete-guide/'
    },
    {
      title: '2024 Tax Country Guide',
      description: 'Detailed breakdown of tax implications in popular digital nomad destinations.',
      link: 'https://immigrantinvest.com/blog/digital-nomad-taxes/'
    },
    {
      title: 'Ultimate US Tax Guide 2024',
      description: 'How to legally minimize tax as an American digital nomad or remote worker.',
      link: 'https://nomadgate.com/us-tax-guide/'
    },
  ],
  banking: [
    {
      title: 'Top Digital Nomad Banks',
      description: 'Comprehensive guide to banks catering to digital nomads with international features.',
      link: 'https://freakingnomads.com/best-banks-for-digital-nomads/'
    },
    {
      title: 'International Banking Guide 2024',
      description: 'Best international bank accounts for expats and digital nomads worldwide.',
      link: 'https://www.monito.com/en/wiki/best-international-bank-accounts-digital-nomads'
    },
    {
      title: 'Offshore Banking Solutions',
      description: 'Guide to offshore banking options with multi-currency accounts and international services.',
      link: 'https://statrys.com/blog/best-banks-digital-nomads'
    },
  ],
  tools: [
    {
      title: 'Document Templates',
      description: 'Collection of essential templates for digital nomads (contracts, invoices, etc.).',
      link: '#'
    },
    {
      title: 'Remote Work Setup',
      description: 'Guide to setting up a reliable remote work environment anywhere.',
      link: '#'
    },
    {
      title: 'Compliance Checklist',
      description: 'Essential checklist for maintaining legal compliance while traveling.',
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
          <Card key={category} className="h-full">
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <a 
                    key={item.title} 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-indigo-600">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}