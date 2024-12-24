import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma"; // or wherever your Prisma instance is
import type { Session, User } from "next-auth";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    session: ({ session, user }: { session: Session; user: User }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    })
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
};
