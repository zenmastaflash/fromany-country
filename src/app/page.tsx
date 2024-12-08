import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold text-center mb-8">
        fromany.country
      </h1>
      <p className="text-xl text-center mb-12">
        Your Global Life, Simplified
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="Track Your Travel"
          description="Stay on top of your global movements and visa requirements"
        />
        <FeatureCard
          title="Tax Compliance"
          description="Monitor your tax obligations across multiple jurisdictions"
        />
        <FeatureCard
          title="Document Management"
          description="Keep all your important documents organized and accessible"
        />
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}