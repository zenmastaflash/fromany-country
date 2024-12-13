import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'https://fromany-country.vercel.app';
const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || '126383503273-94i0fbb66oi80a4qavtjp6v3eo5jtsq9.apps.googleusercontent.com';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'HDq7Fb3uP9x4mK2vL8yN5wR1jT4kX9pZ',
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true
};