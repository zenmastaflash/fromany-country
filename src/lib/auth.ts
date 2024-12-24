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
      callbackUrl: process.env.NEXTAUTH_URL,  // Add this line
      authorization: {
        params: {
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
}

// Restore these lines if your code references 'auth' or 'config'
export const auth = NextAuth(authConfig)
export { authConfig as config }
