import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ]
}

const handler = NextAuth(authConfig)
export const runtime = 'edge'

export { handler as GET, handler as POST }