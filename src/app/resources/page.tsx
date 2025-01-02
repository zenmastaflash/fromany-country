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
  coliving: [
    {
      title: 'Best Coliving Spaces 2024',
      description: 'Curated directory of top-rated coliving spaces worldwide with community reviews.',
      link: 'https://www.coliving.com/spaces'
    },
    {
      title: 'Digital Nomad Houses',
      description: 'Community-driven platform connecting digital nomads with coliving spaces.',
      link: 'https://digitalnomadhouses.com'
    },
    {
      title: 'Coliving Directory',
      description: 'Global directory of vetted coliving spaces with detailed amenities and community features.',
      link: 'https://coliving.directory'
    },
  ],
  geoArbitrage: [
    {
      title: 'Global Cost Calculator',
      description: 'Compare living costs across cities to optimize your global lifestyle.',
      link: 'https://www.numbeo.com/cost-of-living/'
    },
    {
      title: 'Nomad Quality of Life Index',
      description: 'Comprehensive city rankings based on cost, internet, safety, and more.',
      link: 'https://nomadlist.com'
    },
    {
      title: 'Arbitrage Guide 2024',
      description: 'Strategic guide to maximizing your income through geographic arbitrage.',
      link: 'https://www.nomadjunky.com/geo-arbitrage/'
    },
  ],
  tax: [
    {
      title: 'PKF Worldwide Tax Guide 2024',
      description: 'Comprehensive guide covering taxation systems in 150 countries, updated annually.',
      link: 'https://www.pkf.com/publications/tax-guides/worldwide-tax-guide-2023-24/'
    },
    {
      title: 'Global Remote Work Tax Guide',
      description: 'Understanding international tax obligations for remote workers and digital nomads.',
      link: 'https://remote.com/blog/where-remote-workers-pay-taxes'
    },
    {
      title: 'Digital Nomad Tax Navigator',
      description: 'Country-by-country breakdown of tax implications for location-independent workers.',
      link: 'https://velocityglobal.com/resources/blog/remote-work-taxes/'
    },
  ],
  legal: [
    {
      title: 'Global Compliance Guide',
      description: 'Essential legal considerations for digital nomads and remote workers.',
      link: 'https://www.travelingwithkristin.com/digital-nomad-legal-guide'
    },
    {
      title: 'Business Structure Guide',
      description: 'Choosing the right business structure for location-independent entrepreneurs.',
      link: 'https://flagtheory.com/business-structures/'
    },
    {
      title: 'International Contract Templates',
      description: 'Legal templates and documents for global remote work.',
      link: 'https://www.contractscounsel.com/remote-work'
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
      title: 'Remote Work Setup Guide',
      description: 'Comprehensive guide to creating an efficient and ergonomic remote workspace.',
      link: 'https://nomadsunveiled.com/remote-work-setup-tips-nomads-remote-workers/'
    },
    {
      title: 'Digital Nomad Toolkit 2024',
      description: 'Current essential tools, software, and services for location-independent work.',
      link: 'https://www.oberlo.com/blog/digital-nomad'
    },
    {
      title: 'Global Compliance Guide',
      description: 'Essential legal and regulatory requirements for digital nomads worldwide.',
      link: 'https://drummondadvisors.com/en/2024/10/22/complete-guide-for-digital-nomads-essential-legal-rules/'
    },
  ]
};

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Resources</h1>
      <p className="text-xl text-gray-600 mb-8">
        Curated resources to help you thrive as a location-independent professional.
      </p>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                    className="block p-4 rounded-lg bg-secondary hover:bg-secondary-dark transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary">{item.title}</h3>
                    <p className="mt-1 text-link">{item.description}</p>
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
