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
      title: 'Remote Work Setup',
      description: 'Guide to setting up a reliable remote work environment anywhere.',
      link: 'https://www.workfromwherever.co/remote-work-setup'
    },
    {
      title: 'Digital Nomad Tools',
      description: 'Essential software and tools for location-independent professionals.',
      link: 'https://nomadflag.com/digital-nomad-tools'
    },
    {
      title: 'Compliance Checklist',
      description: 'Essential checklist for maintaining legal compliance while traveling.',
      link: 'https://www.remoters.net/compliance-checklist'
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
