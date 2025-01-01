// src/app/api/countries/route.ts
import { NextResponse } from 'next/server';

// Use ISO 3166-1 country codes
const response = await fetch('https://restcountries.com/v3.1/all');
const data = await response.json();
const countries = data
  .map((country: any) => country.name.common)
  .sort();

export async function GET() {
  return NextResponse.json({ countries });
}
