// src/lib/auth.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // renamed for clarity
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Session, SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = Number(token.sub);
      }
      return session;
    },
  },
};

// (Optional) If you need the NextAuth instance in other code:
export const nextAuthInstance = NextAuth(authConfig);
