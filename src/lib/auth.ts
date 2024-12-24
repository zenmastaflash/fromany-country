import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import type { SessionStrategy } from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code"
        }
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
        session.user.id = Number(token.sub)
      }
      return session
    }
  }
}

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(authConfig)
export { authConfig as config }
