// src/lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authConfig: NextAuthOptions = {
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
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("SignIn Callback:", { user, account, profile });
        if (account?.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { 
              image: true,
              terms_accepted_at: true
            }
          });

          // If user exists but hasn't accepted terms
          if (existingUser && !existingUser.terms_accepted_at) {
            // Store the session info temporarily and redirect to terms
            return '/auth/terms?email=' + encodeURIComponent(user.email!);
          }

          // For new users or updating existing ones
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              image: existingUser?.image || user.image,
              // For new users, we'll set terms_accepted_at on the terms page
            }
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        if (session?.user) {
          session.user.id = token.sub!;
          // Get latest user data
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              image: true,
              displayName: true,
            },
          });
          if (user) {
            session.user.image = user.image || session.user.image;
            session.user.name = user.displayName || session.user.name;
          }
        }
        return session;
      } catch (error) {
        console.error("Session Error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

export const auth = NextAuth(authConfig)
export { authConfig as config }
