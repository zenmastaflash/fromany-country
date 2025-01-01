// src/app/api/countries/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-name.json');
    const countries = await response.json();
    return NextResponse.json({ countries: countries.map((c: any) => c.country).sort() });
  } catch (error) {
    return NextResponse.json({ countries: [] }, { status: 500 });
  }
}
