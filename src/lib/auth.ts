import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"; // Corrected import path
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt", // JWT strategy is commonly used for serverless environments
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      // Attach user ID to the session for easier access
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Include user ID in the token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is securely set
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
};
