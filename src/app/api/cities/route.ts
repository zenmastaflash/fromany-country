import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!country) {
    return NextResponse.json({ cities: [] });
  }

  try {
    // Using GeoDB Cities API as an example
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${country}&limit=10`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '', // You'll need to get this API key
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      }
    );
    
    const data = await response.json();
    const cities = data.data.map((city: any) => city.name);
    
    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ cities: [] });
  }
}
