import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { SessionStrategy } from 'next-auth';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code"
        }
      })
  ],
  session: { 
    strategy: 'jwt' as SessionStrategy 
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ? parseInt(token.sub, 10) : 0;
      }
      return session;
    }
  }
};

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(authConfig);
export { authConfig as config };