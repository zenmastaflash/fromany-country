import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const runtime = 'nodejs';

const handler = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
  })],
  secret: process.env.NEXTAUTH_SECRET
});

export const { GET, POST } = handler;