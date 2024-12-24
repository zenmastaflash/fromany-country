// src/lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import type { Session, SessionStrategy } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn Callback:", { user, account, profile, email });
      return true;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = Number(token.sub)
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  logger: {
    error: (code, metadata) => {
      console.error('Auth Error:', code, metadata);
    },
    warn: (code) => {
      console.warn('Auth Warning:', code);
    },
    debug: (code, metadata) => {
      console.debug('Auth Debug:', code, metadata);
    },
  },
}

export const auth = NextAuth(authConfig)
export { authConfig as config }
