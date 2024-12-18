import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
} satisfies NextAuthConfig;