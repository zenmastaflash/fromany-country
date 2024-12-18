import { type NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const runtime = 'nodejs';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ]
};

const handler = NextAuth(authOptions);

export function GET(req: NextRequest) {
  return handler(req);
}

export function POST(req: NextRequest) {
  return handler(req);
}